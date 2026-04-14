# 🚀 CareerNest – Full-Stack Job & Internship Portal

> *A scalable full-stack recruitment platform connecting talent with opportunity.*

---

## 📌 Overview

**CareerNest** is a full-stack Job and Internship Portal designed to bridge the gap between job seekers and recruiters. It provides a seamless platform where users can explore opportunities, apply for jobs, and track applications, while recruiters can post jobs and manage candidates efficiently.

This project demonstrates real-world full-stack development using modern technologies and best practices.

---

## ✨ Features

### 👤 Job Seeker (User)

* User registration & login (JWT authentication)
* Create and update profile
* Browse and search jobs
* Apply for jobs
* Upload resume (PDF)
* Track application status (Applied, Shortlisted, Rejected)

---

### 🏢 Recruiter

* Create, update, and delete job postings
* View applicants for each job
* Manage application status

---

### 🛠️ Admin

* Manage users and recruiters
* Moderate job listings
* Monitor platform activity

---

### 🔎 Job Search & Filtering

* Search by keyword, location, category
* Advanced filters (salary, experience, job type)
* Pagination & sorting

---

## 🧠 Tech Stack

### 💻 Backend

* Java (Core + Advanced)
* Spring Boot
* Spring Security (JWT Authentication)
* Hibernate / JPA
* REST APIs

### 🎨 Frontend

* React.js
* HTML5, CSS3, JavaScript
* Axios

### 🗄️ Database

* MySQL

### ⚙️ Tools & DevOps

* Git & GitHub
* Docker
* Postman

---

## 🏗️ Architecture

* Layered Architecture:

  * Controller
  * Service
  * Repository
  * DTO
* RESTful API design
* Role-Based Access Control (RBAC)
* Scalable & modular structure

---

## 🗂️ Project Structure

### Backend (Spring Boot)

```
src/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 ├── dto/
 ├── config/
 └── security/
```

### Frontend (React)

```
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── hooks/
 └── context/
```

---

## 🧾 Database Design

### Entities:

* User
* Role
* Job
* Application
* Company
* Resume

### Relationships:

* One User → Many Applications
* One Job → Many Applications
* One Company → Many Jobs

---

## 🔐 Authentication & Security

* JWT-based authentication
* Role-based authorization (USER, RECRUITER, ADMIN)
* Secure REST APIs
* Input validation & exception handling

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Java (JDK 8+)
* Node.js & npm
* MySQL / PostgreSQL
* Git

---

### ⚙️ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 🐳 Docker Setup (Optional)

```bash
docker build -t careernest-backend .
docker build -t careernest-frontend .
docker-compose up
```

---

## 📡 API Features

* Authentication APIs (Login/Register)
* Job CRUD APIs
* Application APIs
* User & Recruiter management
* Search & filter APIs

---

## 🧪 Future Enhancements

* Microservices architecture
* Email notifications
* AI-based job recommendations
* Resume parsing
* Real-time chat between recruiter and candidate

---

## 📈 What This Project Demonstrates

* Full-stack development skills
* REST API design
* Database modeling
* Authentication & security
* Clean architecture & scalability
* Real-world problem solving

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork the repository and submit pull requests.

---

## 📬 Contact

If you have any questions or suggestions, feel free to reach out.

---

## ⭐ Show Your Support

If you like this project, please ⭐ the repository and share it!

---
