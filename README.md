<div align="center">

# 🎉 Felicity Event Management System

**A centralized, full-stack event management platform built for college fests — bringing order to the chaos of Google Forms, scattered spreadsheets, and WhatsApp confirmations.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)](https://expressjs.com)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20httpOnly%20Cookies-orange)](https://jwt.io)

**[🚀 Live Demo](https://mern-stack-three-kappa.vercel.app)** • **[📡 API Base](https://mern-stack-czh3.onrender.com/api)**

> ⚠️ Backend is on Render's free tier — first request may take 30–60 seconds to cold-start.

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Libraries, Frameworks & Modules (Justifications)](#-libraries-frameworks--modules-justifications)
- [Advanced Features Implemented](#-advanced-features-implemented)
- [Local Setup](#-local-setup)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)

---

## 🧭 Overview

This is a full-stack MERN event management system designed for **Felicity**, IIIT Hyderabad's annual fest. It replaces the traditional chaos of midnight Google Forms, untracked spreadsheets, and payment screenshots with a structured, role-based platform for Admins, Organizers, and Participants.

---

## 🛠️ Libraries, Frameworks & Modules (Justifications)

### Frontend Technologies
| Library / Tool | Justification & Problem Solved |
|---|---|
| **React + Vite** | **React** enables a declarative component model essential for the complex dashboard UI. **Vite** replaces Create React App to provide significantly faster HMR and optimized build times, solving the problem of sluggish local development. |
| **React Router v6** | Provides declarative nested routing and `Navigate` components, essential for handling role-based route guards and protected routes efficiently. |
| **Tailwind CSS** | **(UI Framework Justification):** Chosen over Material-UI/Bootstrap because it provides utility-first CSS, allowing for rapid, highly customized designs without the overhead of overriding heavy default component styles. It solves the problem of bloated CSS files and context-switching. |
| **Axios** | Used for HTTP requests due to its built-in interceptor support, making it trivial to attach JWT headers globally and handle 401 unauthorized redirects seamlessly compared to the native `fetch` API. |
| **React Hook Form** | Manages complex form states (like dynamic event creation forms) with minimal re-renders, vastly improving performance over controlled React state inputs. |
| **html5-qrcode** | Provides browser-native camera access, solving the problem of requiring organizers to download a native mobile app for QR scanning. |
| **Socket.io-client** | The frontend counterpart for real-time bidirectional communication, required for the live discussion forum and team chat. |

### Backend Technologies
| Library / Tool | Justification & Problem Solved |
|---|---|
| **Node.js & Express.js** | Provides a non-blocking, event-driven runtime ideal for concurrent API requests. Express offers minimal overhead for setting up REST API routes and modular middleware (like JWT verification). |
| **MongoDB + Mongoose** | MongoDB's NoSQL document structure perfectly accommodates dynamic custom form schemas (which vary per event) without requiring rigid SQL schema migrations. Mongoose provides schema validation and relationship mapping. |
| **JWT (jsonwebtoken)** | Solves the problem of server-side session overhead. By using stateless tokens, the REST API remains scalable and horizontally deployable. |
| **bcrypt** | Provides industry-standard adaptive password hashing with configurable salt rounds, mitigating brute-force and rainbow table attacks. |
| **Nodemailer** | Solves the requirement for automated system emails (QR tickets, password resets, confirmations) by providing a robust SMTP transport layer. |
| **qrcode** | Generates QR code data URIs instantly on the server, which are then embedded into HTML emails, allowing organizers to verify tickets securely. |
| **Socket.io** | Powers real-time, low-latency WebSocket communication. It solves the problem of constant HTTP polling for the Discussion Forum and Team Chat by pushing messages instantly. |
| **Joi** | Provides declarative, schema-based payload validation at the route boundary, keeping controllers clean and ensuring data integrity before DB insertion. |
| **json2csv** | Fast, dependency-light conversion of participant arrays to downloadable CSVs for organizer exports. |

---

## 🚀 Advanced Features Implemented

As per the assignment requirements, the following advanced features have been implemented across three tiers.

### Tier A (Core Advanced Features)

#### 1. Hackathon Team Registration
- **Justification:** Chosen to handle complex many-to-many relationships and state machines (invite pending -> accepted -> complete).
- **Explanation & Approach:** The system utilizes a `Team` model referencing multiple participant IDs. A unique invite code is generated upon creation. The registration is gated; the system listens for member acceptances, and a dedicated controller marks the team as `isComplete` once the `requiredSize` is met, subsequently firing a bulk ticket generation routine.
- **Technical Decisions:** Tickets are intentionally withheld until the team is fully formed to prevent orphaned registrations.

#### 3. QR Scanner & Attendance Tracking
- **Justification:** Crucial for physical event management, digitizing the check-in process seamlessly.
- **Explanation & Approach:** Utilizes the `html5-qrcode` library on the frontend to access the device camera. The scanned UUID is sent to a secured backend endpoint which updates the participant's `attendedAt` timestamp.
- **Technical Decisions:** Designed to instantly reject duplicate scans by checking the database timestamp, ensuring accurate live attendance dashboards and CSV exports.

### Tier B (Real-time & Communication Features)

#### 1. Real-Time Discussion Forum
- **Justification:** Enhances participant engagement and demonstrates real-time bidirectional data flow.
- **Explanation & Approach:** Implemented using `Socket.io` namespaces isolated by `eventId`. When participants open the event details, they join a socket room. Messages are emitted and broadcasted instantly to the room while concurrently being persisted in a MongoDB `ForumMessage` collection.
- **Technical Decisions:** Used `Socket.io` over raw WebSockets for its built-in fallback polling, auto-reconnection, and room semantics.

#### 2. Organizer Password Reset Workflow
- **Justification:** Demonstrates complex multi-actor approval workflows and administrative oversight.
- **Explanation & Approach:** Organizers submit a `PasswordResetRequest` document. Admins review this queue. Upon Admin approval, a backend utility generates a secure random password, hashes it, updates the Organizer document, and resolves the request state.
- **Technical Decisions:** Designed as a completely closed-loop system where organizers cannot self-reset, enforcing strict administrative control as per the assignment spec.

#### 3. Team Chat
- **Justification:** Complements the Hackathon Team feature by providing an isolated, secure channel for team collaboration.
- **Explanation & Approach:** Uses `Socket.io` rooms mapped to `teamId`. Only verified team members can join the room. Features real-time message delivery and history persistence.
- **Technical Decisions:** Message history is fetched via REST on initial load, while subsequent messages flow purely through WebSockets for lowest latency.

### Tier C (Integration & Enhancement Features)

#### 1. Anonymous Feedback System
- **Justification:** Provides critical post-event data to organizers without compromising participant privacy.
- **Explanation & Approach:** Participants can submit a 1-5 star rating and text comment for attended events. The backend validates that the user attended the event, but strips personally identifiable information (PII) before saving the feedback document.
- **Technical Decisions:** Organizers receive aggregated averages computed dynamically via MongoDB aggregation pipelines to ensure performance on large datasets.

---

## ⚙️ Local Setup

### Prerequisites

- Node.js 18+
- MongoDB URI (Atlas free tier or local instance)
- SMTP credentials (Gmail app password works)

### 1. Clone the repository

```bash
git clone https://github.com/santhoshkumar-git644/MERN-STACK.git
cd MERN-STACK
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL to http://localhost:<PORT>/api
npm install
npm run dev
```

Both services are fully driven by environment variables — no localhost defaults are hardcoded.

---

## 🗂️ Project Structure

```
MERN-STACK/
├── backend/
│   ├── controllers/          # Route handler logic per domain
│   ├── middleware/           # JWT verification and role guards
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── sockets/              # Socket.io event handlers
│   ├── utils/                # Email, QR, and CSV utilities
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/       # Shared UI components
    │   ├── pages/            # Role-based page views
    │   ├── context/          # Auth context and socket provider
    │   └── utils/            # Axios instance, helpers
    └── vite.config.js
```

---

## 🌐 Deployment

| Layer | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [mern-stack-three-kappa.vercel.app](https://mern-stack-three-kappa.vercel.app) |
| **Backend API** | Render | [mern-stack-czh3.onrender.com/api](https://mern-stack-czh3.onrender.com/api) |
| **Database** | MongoDB Atlas | Connected via `MONGO_URI` environment variable |

<div align="center">

Built with ❤️ for Felicity — IIIT Hyderabad's Annual Fest

</div>
