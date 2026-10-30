# Khushali Wagh - Full Stack Java Developer Portfolio & CMS

A full-stack, responsive, and interactive developer portfolio website with an integrated Admin CMS Dashboard built using **Node.js, Express.js, EJS, and MySQL**.

---

## 🌟 Key Features

### 1. Interactive Portfolio Frontend
- **Hero Section:** Dynamic typing animation, floating 3D tech icons (`Java`, `React.js`, `JavaScript`, `HTML`), neon glow effects, and downloadable resume.
- **About Section:** Highlights educational background, engineering philosophy, and link to complete biography.
- **Featured Projects (Dynamic):** Fetches projects live from MySQL with live demo links, GitHub repositories, and tech stack badges.
- **Technical Skills:** Categorized competencies (Backend, Frontend, Database, Mobile, Tools) with animated skill bars.
- **Experience & Education:** Software Development Internship at Linkcode Pvt. Ltd, B.E. in Computer Engineering from Mumbai University (SGPA: 8.43), and published scientific research papers.
- **Working Contact Form:** Stores contact messages directly into MySQL and notifies via email.

### 2. Admin CMS Dashboard & CRUD Operations
- **Overview Dashboard (`/admin`):** Real-time statistics (Total Projects, Total Messages, Unread Messages, Total Skills), quick actions, and recent messages.
- **Add Project on Dashboard:** Add new portfolio projects with image uploads directly from the dashboard or dedicated page.
- **Full Project CRUD:**
  - **Create:** `/admin/projects/add` (Multi-part image upload with Multer and preview)
  - **Read:** `/admin/projects` (Searchable project list with badges and action buttons)
  - **Update:** `/admin/projects/edit/:id` (Edit details, update tech stack, replace image)
  - **Delete:** `/admin/projects/delete/:id` (Safe removal from MySQL database)
- **Messages Inbox (`/admin/messages`):** View incoming client/recruiter inquiries, read status toggling, direct email replies, and message deletion.
- **Skills Management (`/admin/skills`):** Add, update, and manage technical skills and proficiency percentages.
- **About & Profile (`/admin/about`):** Manage bio, tagline, and contact links.
- **Admin Settings (`/admin/settings`):** Change password and manage credentials.

---

## 🔐 Admin Credentials

- **URL:** `http://localhost:3000/login`
- **Username:** `admin` (or `khushali` / `khushaliwagh17@gmail.com`)
- **Password:** `admin123`

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, Express-Session, Bcrypt, Multer, Nodemailer
- **Frontend:** EJS (Embedded JavaScript), Bootstrap 5, FontAwesome 6, AOS (Animate On Scroll)
- **Database:** MySQL 8.0 (MySQL2 with connection pooling)
- **Styling:** Custom Neon Dark Theme, Glassmorphism, 3D Tilt Animations

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Ensure MySQL is running on your machine. Import the provided SQL schema:
```bash
mysql -u root -p < portfolio.sql
```
*(Default DB name: `portfolio`, configured in `db.js`)*

### 3. Start the Server
```bash
node app.js
```
Open your browser at:
- **Portfolio:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 👤 Author
**Khushali Wagh**  
Full Stack Java Developer | Software Engineer  
- **Email:** khushaliwagh17@gmail.com  
- **LinkedIn:** [linkedin.com/in/khushaliwagh-7a77042b8](https://www.linkedin.com/in/khushaliwagh-7a77042b8)  
- **GitHub:** [github.com/khushaliwagh](https://github.com/khushaliwagh)
