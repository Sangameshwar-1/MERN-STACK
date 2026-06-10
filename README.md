# Felicity MERN Stack Application

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application built for managing college fests and club events. It features three distinct user roles: **Admin**, **Organizer**, and **Participant**.

## 🚀 Features
- **Participants**: Browse events, register for individual or team events, follow clubs, and view custom tickets.
- **Organizers**: Create and manage events, set up custom registration forms, view attendee lists, and request password resets.
- **Admins**: Approve organizer credentials, manage clubs, approve password resets, and view site-wide statistics.
- **UI/UX**: Beautiful glassmorphic design, dynamic animations, responsive layouts.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, React Hook Form, Vanilla CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Multer
- **Infrastructure**: Docker & Docker Compose

## 🏃‍♂️ How to Run Locally

### 1. Prerequisites
- Docker Desktop installed and running.
- Node.js (v18+) if you wish to run without Docker.

### 2. Running with Docker (Recommended)
This will spin up MongoDB, the Backend API, and the Frontend Nginx server automatically.
```bash
docker compose up -d --build
```
- **Frontend**: http://localhost:5173 (or http://localhost depending on port mapping)
- **Backend API**: http://localhost:5000

### 3. Seed the Database
To populate the application with a massive set of sample data (Events, Clubs, Users), run the seed script:
```bash
docker exec -it mern_backend node seed.js
```

### 4. Important Login Credentials
After seeding, you can log in with the following accounts to test the different roles:

**Admin Account**
- **Email:** `admin@felicity.com`
- **Password:** `Admin@123`

**Organizer (Felicity Core Team)**
- **Email:** `felicitycoreteam@iiit.ac.in`
- **Password:** `password123`

**Participant**
- **Email:** `sameer.das0@students.iiit.ac.in` (Or any seeded participant email)
- **Password:** `password123`

## 📁 Project Structure
- `/backend`: Express API, Mongoose Models, Controllers, Middleware.
- `/frontend`: React application, pages categorized by roles (`/auth`, `/admin`, `/organizer`, `/participant`).

## 🔑 Key Workflows
1. **Password Resets**: Organizers can request a reset from their profile (`/organizer/profile`). Admins can approve it from (`/admin/password-resets`), which resets the password to the default (`password123`).
2. **Custom Forms**: Organizers can build dynamic forms when creating an event (`/organizer/events/new`). Participants must fill these out upon registration.
3. **Clubs Directory**: Participants can browse all registered clubs and follow them to get curated event feeds.
