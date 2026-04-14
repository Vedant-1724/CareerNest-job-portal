# 🪺 CareerNest — Job & Internship Portal

A production-grade, full-stack job and internship platform built with **Java Spring Boot** (backend) and **React** (frontend).

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square)

---

## 🏗 Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   React UI  │────▶│  Spring Boot    │────▶│  PostgreSQL  │
│  (Vite/Nginx)│     │  REST API       │     │  Database    │
└─────────────┘     └─────────────────┘     └──────────────┘
     :3000               :8080                   :5432
```

## ✨ Features

### 👤 Job Seekers (USER)
- Browse and search jobs with filters (keyword, location, category, salary, experience)
- Apply to jobs with cover letters
- Track application status (Applied → Shortlisted → Accepted/Rejected)
- Upload resume (PDF)
- Profile management

### 🏢 Recruiters (RECRUITER)
- Create and manage companies
- Post, edit, and delete job listings
- View and manage applicants
- Update application statuses

### ⚙️ Administrators (ADMIN)
- Platform-wide statistics dashboard
- User management (view, delete)
- Job moderation

### 🔐 Security
- JWT-based authentication (stateless)
- Role-based access control (USER, RECRUITER, ADMIN)
- BCrypt password encryption
- Protected API endpoints

---

## 🚀 Quick Start

### Prerequisites
- **Java 21+**
- **Node.js 18+**
- **Docker & Docker Compose**

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/CareerNest.git
cd CareerNest

# Start all services
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### Option 2: Local Development

#### 1. Start PostgreSQL
```bash
docker-compose up postgres
```

#### 2. Start Backend
```bash
cd backend
./mvnw spring-boot:run    # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

---

## 📁 Project Structure

```
CareerNest/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/careernest/
│   │   ├── config/             # Security, CORS, data seeder
│   │   ├── controller/         # REST controllers (7)
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities (6)
│   │   ├── enums/              # Enum types (4)
│   │   ├── exception/          # Global exception handler
│   │   ├── repository/         # Spring Data repositories (6)
│   │   ├── security/           # JWT provider, filters, UserDetails
│   │   └── service/            # Business logic services (6)
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React application
│   ├── src/
│   │   ├── api/                # Axios instance + API services
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth context (JWT state)
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── jobs/           # Job listing, Job detail
│   │   │   ├── user/           # User dashboard
│   │   │   ├── recruiter/      # Recruiter dashboard
│   │   │   └── admin/          # Admin panel
│   │   └── routes/             # Protected route component
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/users/me` | Auth | Profile |
| PUT | `/api/users/me` | Auth | Update profile |
| GET | `/api/jobs` | Public | List jobs |
| GET | `/api/jobs/{id}` | Public | Job details |
| GET | `/api/jobs/search` | Public | Search jobs |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/{id}` | Recruiter | Update job |
| DELETE | `/api/jobs/{id}` | Recruiter/Admin | Delete job |
| POST | `/api/applications/{jobId}` | User | Apply |
| GET | `/api/applications/my` | User | My applications |
| GET | `/api/applications/job/{id}` | Recruiter | Job applicants |
| PUT | `/api/applications/{id}/status` | Recruiter | Update status |
| POST | `/api/companies` | Recruiter | Create company |
| GET | `/api/companies` | Public | List companies |
| POST | `/api/resumes/upload` | User | Upload resume |
| GET | `/api/admin/stats` | Admin | Platform stats |
| GET | `/api/admin/users` | Admin | List users |

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.12.6) |
| Database | PostgreSQL 16 |
| ORM | Hibernate 6 |
| Frontend | React 18, React Router 6, Axios, Vite |
| Styling | Vanilla CSS (Premium Dark Theme) |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx (production) |

---
