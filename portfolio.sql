-- Portfolio Database Schema & Seed Data
-- Khushali Wagh | Full Stack Java Developer Portfolio

CREATE DATABASE IF NOT EXISTS `portfolio`;
USE `portfolio`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `technology` VARCHAR(255),
  `github` VARCHAR(255),
  `demo` VARCHAR(255),
  `image` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read') DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `level` INT DEFAULT 80
);

-- 6. Experience Table
CREATE TABLE IF NOT EXISTS `experience` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `company` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `period` VARCHAR(100),
  `start_date` VARCHAR(255),
  `end_date` VARCHAR(255),
  `description` VARCHAR(2000)
);

-- 7. Profile Table
CREATE TABLE IF NOT EXISTS `profile` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `tagline` VARCHAR(255),
  `about_text` VARCHAR(4000),
  `email` VARCHAR(255),
  `github` VARCHAR(255),
  `linkedin` VARCHAR(255),
  `image_url` VARCHAR(255)
);

-- Default Admin User (Password: admin123)
INSERT INTO `admin_users` (`id`, `username`, `password_hash`)
VALUES (1, 'admin', '$2a$10$eWZBWXg2g9V2K1s62GZo2.5s2hG1K9ItbB35gEujAsnFPPtDApeea')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- Default Khushali User (Password: admin123)
INSERT INTO `users` (`id`, `username`, `password`)
VALUES (1, 'khushaliwagh17@gmail.com', '$2b$10$5MhE9V10L1g0k2v1E.wJse3h4rW6Z8j2t4K9X0Y1Z2A3B4C5D6E7F')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- Seed Profile Data
INSERT INTO `profile` (`id`, `name`, `tagline`, `about_text`, `email`, `github`, `linkedin`, `image_url`)
VALUES (1, 'Khushali Wagh', 'Full Stack Java Developer | Software Engineer', 
'Computer Engineering graduate (2026) and Full Stack Java Developer with a strong foundation in programming fundamentals, Object-Oriented Programming, Data Structures and database concepts. Hands-on experience developing, testing, debugging and maintaining Java and Spring Boot applications, writing SQL queries and managing MySQL databases, and building React.js front ends integrated through REST APIs.',
'khushaliwagh17@gmail.com', 'https://github.com/khushaliwagh', 'https://linkedin.com/in/khushaliwagh-7a77042b8', '/images/Firefly.png')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `tagline` = VALUES(`tagline`), `about_text` = VALUES(`about_text`);

-- Seed Projects Data from Resume
INSERT INTO `projects` (`id`, `title`, `description`, `technology`, `github`, `demo`, `image`) VALUES
(1, 'Full-Stack E-Commerce Application', 
'Developed a full-stack e-commerce application with a React frontend and Java Spring Boot backend, integrating REST APIs for product data. Implemented centralized product state management using Redux Toolkit to manage product data and asynchronous API requests. Integrated a MySQL database to persist application data and configured a cloud-hosted database for deployment. Deployed frontend on Vercel and backend on Render with CORS.',
'Java, Spring Boot, React.js, Redux Toolkit, MySQL, REST APIs, Axios, Git, GitHub, Vercel, Render',
'https://github.com/khushaliwagh/ecommerce-app', 'https://ecommerce-app-swart-ten-81.vercel.app/', 'ecommerce.png'),

(2, 'BlogSpace – Full-Stack Blog Management Website',
'Developed a full-stack blog application with a React frontend and a Spring Boot backend. Designed and integrated REST API endpoints to support communication between frontend and backend. Implemented authentication and application security using Spring Security with CSRF protection. Configured frontend-backend integration and cross-origin security.',
'Java, Spring Boot, React.js, REST APIs, Spring Security, Git, GitHub',
'https://github.com/khushaliwagh/blogspace', 'https://github.com/khushaliwagh/blogspace', 'blogspace.png'),

(3, 'Task Manager – Full-Stack Web Application',
'Developed a full-stack task management application using React.js for the frontend and Spring Boot for backend services. Implemented REST API endpoints to create, retrieve, update and delete tasks (CRUD operations). Integrated frontend with backend APIs to manage task data; configured database connectivity and tested CRUD operations across application layers.',
'Java, Spring Boot, React.js, REST APIs, MySQL, JavaScript, Git, GitHub',
'https://github.com/khushaliwagh/task-manager', 'https://github.com/khushaliwagh/task-manager', 'taskmanager.png'),

(4, 'Brightmind – Interactive Learning App for Children',
'Developed an interactive Android learning app using Java and XML. Implemented voice guidance, visual learning content and scanning functionality to increase engagement. Applied Java and OOP concepts to build maintainable application features.',
'Java, Android, XML, OOP, Mobile Development',
'https://github.com/khushaliwagh/brightmind-app', 'https://github.com/khushaliwagh/brightmind-app', 'brightmind.png')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `description` = VALUES(`description`), `technology` = VALUES(`technology`);

-- Seed Experience Data
INSERT INTO `experience` (`id`, `company`, `role`, `period`, `start_date`, `end_date`, `description`) VALUES
(1, 'Linkcode Pvt. Ltd', 'Software Development Intern', 'June 2026 - Present', 'June 2026', 'Present', 
'Contributed to a team software project building RESTful APIs and Java-based components in a real-world environment. Applied Core Java, coding standards and software engineering best practices, including API integration and CRUD operations with database-backed services. Debugged and resolved application issues while working in an Agile workflow and meeting project delivery timelines.')
ON DUPLICATE KEY UPDATE `role` = VALUES(`role`), `company` = VALUES(`company`);
