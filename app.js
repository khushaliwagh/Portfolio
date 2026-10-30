const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const multer = require("multer");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "khushali_portfolio_secret_2026",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
  })
);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "public", "uploads", "projects");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication Middleware
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Helper: Query Database with Promises
function queryDb(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "khushaliwagh17@gmail.com",
    pass: process.env.EMAIL_PASS || "rdfh egve aqyp zoem"
  }
});

// ==========================================
// PUBLIC PORTFOLIO ROUTES
// ==========================================

// Homepage
app.get("/", async (req, res) => {
  try {
    const projects = await queryDb("SELECT * FROM projects ORDER BY id DESC");
    const skills = await queryDb("SELECT * FROM skills ORDER BY category, name");
    let profile = await queryDb("SELECT * FROM profile LIMIT 1");

    res.render("index", {
      projects: projects || [],
      skills: skills || [],
      profile: (profile && profile[0]) || null,
      contactSuccess: req.query.contact === "success",
      user: req.session.user || null
    });
  } catch (err) {
    console.error("Error loading portfolio:", err.message);
    res.render("index", {
      projects: [],
      skills: [],
      profile: null,
      contactSuccess: false,
      user: req.session.user || null
    });
  }
});

// Read More (About Biography & Journey)
app.get("/read-more", async (req, res) => {
  try {
    const profile = await queryDb("SELECT * FROM profile LIMIT 1");
    const skills = await queryDb("SELECT * FROM skills ORDER BY category, name");
    res.render("ReadMore", {
      profile: (profile && profile[0]) || null,
      skills: skills || []
    });
  } catch (err) {
    console.error("Error loading ReadMore:", err.message);
    res.render("ReadMore", { profile: null, skills: [] });
  }
});

// Contact Form Handler
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.redirect("/#contact");
  }

  try {
    // 1. Save to Database
    await queryDb(
      "INSERT INTO contact_messages (name, email, message, status) VALUES (?, ?, ?, 'Unread')",
      [name, email, message]
    );

    // 2. Attempt Email notification (safe catch to never block user)
    try {
      await transporter.sendMail({
        from: `"Khushali Portfolio" <khushaliwagh17@gmail.com>`,
        to: "khushaliwagh17@gmail.com",
        replyTo: email,
        subject: `New Portfolio Inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nReceived at: ${new Date().toLocaleString()}`
      });
    } catch (emailErr) {
      console.warn("Email alert could not be sent (message saved to DB):", emailErr.message);
    }

    res.redirect("/?contact=success#contact");
  } catch (err) {
    console.error("Error saving contact message:", err.message);
    res.redirect("/?contact=success#contact");
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Login Page
app.get("/login", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/admin");
  }
  res.render("login", {
    error: req.query.error || null,
    success: req.query.registered ? "Account created successfully! Please login." : null
  });
});

// Login POST Handler
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", { error: "Please enter both username and password", success: null });
  }

  try {
    // Check default super admin credentials
    if (
      (username.trim().toLowerCase() === "admin" && password === "admin123") ||
      (username.trim().toLowerCase() === "khushali" && password === "admin123") ||
      (username.trim().toLowerCase() === "khushaliwagh17@gmail.com" && password === "admin123")
    ) {
      req.session.user = { username: "Khushali (Admin)", role: "admin" };
      return res.redirect("/admin");
    }

    // Check users table
    const users = await queryDb("SELECT * FROM users WHERE username = ?", [username.trim()]);
    if (users && users.length > 0) {
      const user = users[0];
      const match = bcrypt.compareSync(password, user.password) || user.password === password;
      if (match) {
        req.session.user = { id: user.id, username: user.username, role: "admin" };
        return res.redirect("/admin");
      }
    }

    // Check admin_users table
    const adminUsers = await queryDb("SELECT * FROM admin_users WHERE username = ?", [username.trim()]);
    if (adminUsers && adminUsers.length > 0) {
      const admin = adminUsers[0];
      const match = bcrypt.compareSync(password, admin.password_hash) || admin.password_hash === password;
      if (match) {
        req.session.user = { id: admin.id, username: admin.username, role: "admin" };
        return res.redirect("/admin");
      }
    }

    res.render("login", { error: "Invalid username or password", success: null });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.render("login", { error: "An unexpected error occurred. Please try again.", success: null });
  }
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// Signup POST Handler
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("signup", { error: "All fields are required" });
  }

  try {
    const existing = await queryDb("SELECT id FROM users WHERE username = ?", [username.trim()]);
    if (existing && existing.length > 0) {
      return res.render("signup", { error: "User already exists. Please choose another username or log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await queryDb("INSERT INTO users (username, password) VALUES (?, ?)", [username.trim(), hashedPassword]);

    res.redirect("/login?registered=true");
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.render("signup", { error: "Failed to create account. Please try again." });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// ==========================================
// ADMIN DASHBOARD & CRUD ROUTES
// ==========================================

// Dashboard Home
app.get(["/admin", "/admin/dashboard"], isLoggedIn, async (req, res) => {
  try {
    const [projectCount] = await queryDb("SELECT COUNT(*) AS total FROM projects");
    const [msgCount] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages");
    const [unreadCount] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");
    const [skillCount] = await queryDb("SELECT COUNT(*) AS total FROM skills");

    const projects = await queryDb("SELECT * FROM projects ORDER BY id DESC");
    const messages = await queryDb("SELECT * FROM contact_messages ORDER BY created_at DESC");

    res.render("admin", {
      stats: {
        totalProjects: projectCount ? projectCount.total : 0,
        totalMessages: msgCount ? msgCount.total : 0,
        unreadMessages: unreadCount ? unreadCount.total : 0,
        totalSkills: skillCount ? skillCount.total : 0
      },
      projects: projects || [],
      messages: messages || [],
      user: req.session.user,
      success: req.query.success || null,
      error: req.query.error || null,
      active: "dashboard"
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.render("admin", {
      stats: { totalProjects: 0, totalMessages: 0, unreadMessages: 0, totalSkills: 0 },
      projects: [],
      messages: [],
      user: req.session.user,
      success: null,
      error: "Error retrieving dashboard statistics: " + err.message,
      active: "dashboard"
    });
  }
});

// Manage Projects (List)
app.get("/admin/projects", isLoggedIn, async (req, res) => {
  try {
    const projects = await queryDb("SELECT * FROM projects ORDER BY id DESC");
    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/projects", {
      projects: projects || [],
      unreadCount: unread ? unread.total : 0,
      active: "projects"
    });
  } catch (err) {
    console.error("Error loading projects list:", err.message);
    res.render("admin/projects", { projects: [], unreadCount: 0, active: "projects" });
  }
});

// Add Project Page (GET)
app.get("/admin/projects/add", isLoggedIn, async (req, res) => {
  const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");
  res.render("admin/addProject", {
    unreadCount: unread ? unread.total : 0,
    active: "add-project"
  });
});

// Add Project Handler (POST)
app.post("/admin/projects/add", isLoggedIn, upload.single("image"), async (req, res) => {
  const { title, description, technology, github, demo } = req.body;

  if (!title || !description) {
    return res.redirect("/admin?error=Title+and+Description+are+required");
  }

  // Graceful default image if none provided
  const image = req.file ? req.file.filename : "webs.png";

  try {
    await queryDb(
      "INSERT INTO projects (title, description, technology, github, demo, image) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, technology || "", github || "", demo || "", image]
    );

    res.redirect("/admin?success=Project+created+successfully!");
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.redirect("/admin?error=" + encodeURIComponent(err.message));
  }
});

// Edit Project Page (GET)
app.get("/admin/projects/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const result = await queryDb("SELECT * FROM projects WHERE id = ?", [req.params.id]);
    if (!result || result.length === 0) {
      return res.redirect("/admin/projects?error=Project+not+found");
    }
    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/editProject", {
      project: result[0],
      unreadCount: unread ? unread.total : 0,
      active: "projects"
    });
  } catch (err) {
    console.error("Error loading project for edit:", err.message);
    res.redirect("/admin/projects");
  }
});

// Update Project Handler (POST)
app.post("/admin/projects/update/:id", isLoggedIn, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description, technology, github, demo, existingImage } = req.body;

  try {
    if (req.file) {
      const newImage = req.file.filename;
      await queryDb(
        "UPDATE projects SET title = ?, description = ?, technology = ?, github = ?, demo = ?, image = ? WHERE id = ?",
        [title, description, technology, github, demo, newImage, id]
      );
    } else {
      await queryDb(
        "UPDATE projects SET title = ?, description = ?, technology = ?, github = ?, demo = ? WHERE id = ?",
        [title, description, technology, github, demo, id]
      );
    }

    res.redirect("/admin/projects");
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.redirect("/admin/projects");
  }
});

// Delete Project Handler
app.get("/admin/projects/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await queryDb("DELETE FROM projects WHERE id = ?", [id]);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res.redirect("/admin/projects");
  }
});

// ==========================================
// ADMIN MESSAGES CRUD ROUTES
// ==========================================

// Messages List
app.get("/admin/messages", isLoggedIn, async (req, res) => {
  try {
    const messages = await queryDb("SELECT * FROM contact_messages ORDER BY created_at DESC");
    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/messages", {
      messages: messages || [],
      unreadCount: unread ? unread.total : 0,
      active: "messages"
    });
  } catch (err) {
    console.error("Error loading messages:", err.message);
    res.render("admin/messages", { messages: [], unreadCount: 0, active: "messages" });
  }
});

// View Message (Marks as Read)
app.get("/admin/messages/view/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await queryDb("UPDATE contact_messages SET status = 'Read' WHERE id = ?", [id]);
    const result = await queryDb("SELECT * FROM contact_messages WHERE id = ?", [id]);

    if (!result || result.length === 0) {
      return res.redirect("/admin/messages");
    }

    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/viewMessage", {
      message: result[0],
      unreadCount: unread ? unread.total : 0,
      active: "messages"
    });
  } catch (err) {
    console.error("Error viewing message:", err.message);
    res.redirect("/admin/messages");
  }
});

// Delete Message
app.get("/admin/messages/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await queryDb("DELETE FROM contact_messages WHERE id = ?", [req.params.id]);
    res.redirect("/admin/messages");
  } catch (err) {
    console.error("Error deleting message:", err.message);
    res.redirect("/admin/messages");
  }
});

// ==========================================
// ADMIN SKILLS CRUD ROUTES
// ==========================================

// Skills List & Manage
app.get("/admin/skills", isLoggedIn, async (req, res) => {
  try {
    const skills = await queryDb("SELECT * FROM skills ORDER BY category, name");
    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/skills", {
      skills: skills || [],
      unreadCount: unread ? unread.total : 0,
      active: "skills"
    });
  } catch (err) {
    console.error("Error loading skills:", err.message);
    res.render("admin/skills", { skills: [], unreadCount: 0, active: "skills" });
  }
});

// Add Skill
app.post("/admin/skills/add", isLoggedIn, async (req, res) => {
  const { name, category, level } = req.body;
  try {
    await queryDb("INSERT INTO skills (name, category, level) VALUES (?, ?, ?)", [
      name.trim(),
      category || "Backend",
      parseInt(level) || 80
    ]);
    res.redirect("/admin/skills");
  } catch (err) {
    console.error("Error adding skill:", err.message);
    res.redirect("/admin/skills");
  }
});

// Delete Skill
app.get("/admin/skills/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await queryDb("DELETE FROM skills WHERE id = ?", [req.params.id]);
    res.redirect("/admin/skills");
  } catch (err) {
    console.error("Error deleting skill:", err.message);
    res.redirect("/admin/skills");
  }
});

// ==========================================
// ADMIN ABOUT & PROFILE ROUTES
// ==========================================

// View Profile
app.get("/admin/about", isLoggedIn, async (req, res) => {
  try {
    const profile = await queryDb("SELECT * FROM profile LIMIT 1");
    const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");

    res.render("admin/about", {
      profile: (profile && profile[0]) || null,
      unreadCount: unread ? unread.total : 0,
      active: "about"
    });
  } catch (err) {
    console.error("Error loading profile:", err.message);
    res.render("admin/about", { profile: null, unreadCount: 0, active: "about" });
  }
});

// Update Profile
app.post("/admin/about/update", isLoggedIn, async (req, res) => {
  const { name, tagline, about_text, email, linkedin, github } = req.body;
  try {
    const existing = await queryDb("SELECT id FROM profile LIMIT 1");
    if (existing && existing.length > 0) {
      await queryDb(
        "UPDATE profile SET name = ?, tagline = ?, about_text = ?, email = ?, linkedin = ?, github = ? WHERE id = ?",
        [name, tagline, about_text, email, linkedin, github, existing[0].id]
      );
    } else {
      await queryDb(
        "INSERT INTO profile (name, tagline, about_text, email, linkedin, github) VALUES (?, ?, ?, ?, ?, ?)",
        [name, tagline, about_text, email, linkedin, github]
      );
    }
    res.redirect("/admin/about");
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.redirect("/admin/about");
  }
});

// ==========================================
// ADMIN SETTINGS ROUTES
// ==========================================

// Settings Page
app.get("/admin/settings", isLoggedIn, async (req, res) => {
  const [unread] = await queryDb("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'Unread'");
  res.render("admin/settings", {
    user: req.session.user,
    unreadCount: unread ? unread.total : 0,
    active: "settings"
  });
});

// Change Password Handler
app.post("/admin/settings/password", isLoggedIn, async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || newPassword !== confirmPassword) {
    return res.redirect("/admin/settings?error=Passwords+do+not+match");
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const username = req.session.user.username;

    await queryDb("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'", [hash]);
    await queryDb("UPDATE users SET password = ? WHERE username = ?", [hash, username]);

    res.redirect("/admin/settings?success=Password+updated+successfully");
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.redirect("/admin/settings?error=Failed+to+update+password");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
});
