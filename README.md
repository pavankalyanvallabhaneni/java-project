# 🇮🇳 BharatHire - Recruitment Platform & Job Portal

> **Connecting Bharat's Brightest Talent with Leading Enterprises & Startups.**

BharatHire is a full-stack job portal and recruitment management platform built specifically for the Indian employment ecosystem. It features role-based workflows for **Job Seekers (Candidates)**, **Recruiters (Employers)**, and **Administrators**, complete with applicant tracking, real-time status progression, virtual interview scheduling, PDF resume handling, and trust & safety moderation.

---

## 🏗️ Architecture & Technology Stack

### 🚀 Backend (Spring Boot 3.3.4 + Java 21)
- **Framework:** Spring Boot 3.3.4 with Spring Web, Spring Data JPA, Spring Security
- **Authentication:** JWT (HMAC-SHA256) stateless token security
- **Database Support:**
  - **Dev Profile:** H2 Database (MySQL compatibility mode) with pre-seeded demo users & vacancies
  - **Prod/MySQL Profile:** MySQL 8.x database with Docker Compose setup
- **Database Migrations:** Flyway migrations (`V1__init_schema.sql`, `V2__seed_demo_data.sql`)
- **API Documentation:** OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Testing:** JUnit 5, AssertJ, Spring Boot Test, MockMvc (16 unit & integration tests)

### 🎨 Frontend (React 18 + Vite 6)
- **UI Framework:** React 18, React Router v6, Axios, Lucide Icons
- **Design System:** Custom Indian Palette (**Warm Ivory**, **Cream**, **Deep Maroon**, **Saffron Gold**, **Muted Green**)
- **State Management:** Context API (`AuthContext`, `NotificationContext`)
- **Responsive Layout:** Mobile-friendly drawer navigation, responsive grids, and desktop navbar

---

## 👥 Demo Accounts & Pre-Seeded Roles

For instant testing, use any of the pre-seeded accounts (or use the 1-click switcher on `/login`):

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Job Seeker (Candidate)** | `arun.kumar@gmail.com` | `Candidate@123` | Full Stack Java & React Engineer (Bengaluru) |
| **Job Seeker (Candidate)** | `neha.singh@gmail.com` | `Candidate@123` | Data Analyst & Python Specialist (Pune) |
| **Employer / Recruiter** | `recruiter@tcs.in` | `Recruiter@123` | Lead Talent Acquisition, Tata Consultancy Services |
| **Employer / Recruiter** | `recruiter@infosys.in` | `Recruiter@123` | Campus & Lateral Hiring Lead, Infosys |
| **Platform Administrator** | `admin@bharathire.in` | `Admin@123` | Security, Moderation & Company Verification |

---

## ⚡ Quick Start & Running Locally

### Option A: 1-Click Launch (Windows)
Double-click `run_project.bat` in the project root. This starts both the Spring Boot backend on port `8080` and the Vite dev server on port `5173`.

### Option B: Run in Separate Terminals

#### 1. Backend Server
```powershell
cd backend
mvn spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:bharathire_db`)

#### 2. Frontend Development Server
```powershell
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🌟 Key Features

### 🔍 1. Candidate Portal (`/candidate/*`)
- **Browse & Search Jobs:** Keyword, city (Bengaluru, Hyderabad, Pune, Mumbai, Delhi-NCR, Remote), work mode, and domain filters.
- **1-Click Application:** Select existing resume or upload a new PDF resume (up to 5MB) with personalized cover note.
- **Real-Time Stage Tracker:** Visual stepper (`Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected` / `Rejected`).
- **Interview Hub:** View scheduled rounds with meeting links (Google Meet, Zoom) and agenda notes.
- **Bookmarks & Saved Jobs:** Pin prospective opportunities for later review.
- **Comprehensive Profile:** Manage Headline, Bio, Skills, Experience, Education, Expected CTC (in INR), and notice period.

### 🏢 2. Recruiter Portal (`/recruiter/*`)
- **Vacancy Management:** Create and edit job openings with skill tags, compensation ranges (in ₹ LPA), work mode, and deadlines.
- **Recruitment Funnel & Analytics:** Live metrics tracking Total Applicants, Under Review, Shortlisted, and Interviews.
- **Applicant Evaluation Pipeline:** Review candidate credentials, download resumes in PDF, update status with recruiter notes.
- **Built-in Interview Scheduler:** Schedule interview rounds with duration, meeting link, and candidate instructions.
- **Organization Branding:** Update company profile, headquarters, size, industry, and logo URL.

### 🛡️ 3. Admin & Security Portal (`/admin/*`)
- **System KPIs:** Real-time platform counts across candidates, recruiters, jobs, and applications.
- **User Control:** Inspect registered accounts with 1-click status toggling (`ACTIVE` ⇄ `SUSPENDED`).
- **Employer Verification:** Review and grant verified employer badges to trustworthy companies.
- **Trust & Moderation Queue:** Review reported vacancies for fraudulent or misleading content and record resolutions.
- **Security Audit Trails:** Immutable logs tracking user actions, entity modifications, timestamps, and IP addresses.
