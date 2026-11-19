# Khushali Wagh | Full Stack Developer Portfolio & Admin CMS

A modern, responsive, and interactive developer portfolio website with an integrated Admin CMS Dashboard, built using **Node.js, Express.js, EJS, and TiDB Cloud (MySQL-compatible database)**.

The application allows visitors to explore projects, technical skills, professional experience, and contact information. The integrated admin dashboard provides complete content management capabilities.

---

## 🌟 Key Features

### 1. Interactive Portfolio Website

- **Hero Section:** Dynamic typing animation, floating technology icons, neon glow effects, and downloadable resume.
- **About Section:** Professional introduction, educational background, and developer biography.
- **Featured Projects:** Dynamically fetches projects from the database, including descriptions, images, GitHub repositories, live demos, and technology badges.
- **Technical Skills:** Categorized technical competencies with animated skill bars.
- **Experience & Education:** Professional experience, academic background, and achievements.
- **Contact Form:** Accepts visitor inquiries, stores messages in the database, and supports email notifications.

### 2. Admin CMS Dashboard

A dedicated admin dashboard for managing portfolio content without manually editing website code.

**Dashboard Overview**
- Total projects
- Total messages
- Unread messages
- Total technical skills
- Recent messages and quick actions

**Project Management**
- Add new projects.
- View and search existing projects.
- Edit project information.
- Upload and replace project images.
- Delete projects.

**Messages Management**
- View contact form submissions.
- Read incoming messages.
- Mark messages as read or unread.
- Reply through email.
- Delete messages.

**Skills Management**
- Add technical skills.
- Update skill names and categories.
- Manage proficiency percentages.
- Delete existing skills.

**Profile & About Management**
- Update professional biography.
- Manage profile information.
- Update tagline and contact links.

**Admin Settings**
- Change administrator password.
- Manage account credentials securely.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | EJS, HTML5, CSS3, JavaScript |
| UI Framework | Bootstrap 5 |
| Icons | Font Awesome 6 |
| Database | TiDB Cloud (MySQL-compatible) |
| Database Driver | MySQL2 |
| Authentication | Express Session, Bcrypt |
| File Uploads | Multer |
| Email | Nodemailer |
| Environment Configuration | dotenv |
| Version Control | Git, GitHub |
| Deployment | Render |
 
---

## 🗄️ Database Configuration

The application uses **TiDB Cloud**, a managed, MySQL-compatible database service.

Database name: `portfolio`

The application uses MySQL2 connection pooling and TLS configuration to connect securely to the database.

### Database Tables

- `admin_users`
- `contact_messages`
- `experience`
- `profile`
- `projects`
- `skills`
- `users`

---

## 🚀 Local Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/khushaliwagh/Portfolio.git
```

### 2. Navigate to the Project

```bash
cd Portfolio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

Use the following structure:

```env
PORT=3000

DB_HOST=your_tidb_host
DB_PORT=4000
DB_NAME=portfolio
DB_USER=your_tidb_username
DB_PASSWORD=your_tidb_password

SESSION_SECRET=your_secure_session_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Replace the placeholder values with your own credentials.

**Important:**
- Never upload `.env` to GitHub.
- Never publish database credentials or session secrets.
- Use a Google App Password for Gmail SMTP authentication where applicable.
- Keep the TiDB CA certificate file `isrgrootx1.pem` available at the project root when using the current TLS configuration.

### 5. Database Setup

The application connects to the configured TiDB Cloud database.

If setting up a completely new database, prepare the database schema using the provided `portfolio.sql` file.

For an existing database containing your portfolio data, do not import the SQL file again unless you have verified that the import is appropriate. Preserve existing records.

### 6. Start the Application

```bash
npm start
```

The application runs locally at:

- **Portfolio:** http://localhost:3000
- **Admin Login:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/admin

---

## ☁️ Deployment

The application uses two cloud services:

| Service | Purpose |
|---|---|
| GitHub | Source code repository |
| TiDB Cloud | Managed MySQL-compatible database |
| Render | Node.js application hosting |

### Deploying on Render

1. Push the project to GitHub.
2. Sign in to [Render](https://render.com/).
3. Create a new Web Service.
4. Connect the GitHub repository.
5. Select the `main` branch.
6. Configure the build and start commands.

**Build Command**

```bash
npm install
```

**Start Command**

```bash
npm start
```

### Render Environment Variables

Configure the following variables in the Render dashboard:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
SESSION_SECRET
EMAIL_USER
EMAIL_PASS
```

Use the same existing TiDB Cloud database connection details that work locally. Do not commit secrets to GitHub.

Render provides the `PORT` environment variable automatically.

### TiDB Cloud Network Access

Ensure your TiDB Cloud network access configuration permits connections from your Render service. Use an appropriate network access policy and TLS encryption.

---

## 🔒 Security

- Password hashing with Bcrypt.
- Session-based authentication.
- Environment-based configuration.
- Database connections secured with TLS.
- Sensitive configuration excluded through `.gitignore`.
- Admin credentials are not published in this repository.

---

## 📁 Project Structure

```text
Portfolio/
│
├── app.js
├── db.js
├── package.json
├── package-lock.json
├── .gitignore
├── isrgrootx1.pem
├── portfolio.sql
│
├── views/
│   └── index.ejs
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
│
└── README.md
```

*Note: The structure above shows the main application files. Additional folders and files may exist in the repository.*

---

## 👩‍💻 Author

**Khushali Wagh**

Full Stack Java Developer | Software Engineer

- **Email:** khushaliwagh17@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/khushaliwagh-7a77042b8
- **GitHub:** https://github.com/khushaliwagh

---

## 🎯 Project Objective

To build a dynamic, database-driven developer portfolio with a secure content management system, demonstrating practical knowledge of backend development, database integration, CRUD operations, authentication, and cloud deployment.

---

⭐ If you find this project useful, feel free to explore the repository and connect with me!
