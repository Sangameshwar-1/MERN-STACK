# Felicity Event Management System

A centralized event management platform built for college fests using the MERN stack. This system replaces chaotic Google Forms, spreadsheets, and WhatsApp groups with a seamless, role-based platform for Participants, Organizers, and Admins.

## 🚀 Technology Stack

### Frontend
| Library/Framework | Justification |
|---|---|
| React (Vite) | Fast build tool, hot module replacement, modern React with ES modules |
| React Router v6 | Client-side routing with nested layouts and protected routes |
| Axios | HTTP client with interceptors for automatic JWT token attachment |
| React Hook Form | Performant form validation with minimal re-renders |
| Socket.io-client | Real-time discussion forum and live updates |
| qrcode.react | QR code rendering in the browser |
| react-qr-reader | Camera-based QR code scanning for organizers |

### Backend
| Library/Framework | Justification |
|---|---|
| Node.js + Express.js | Lightweight, scalable REST API framework |
| MongoDB + Mongoose | Flexible schema-less database with ODM for data modeling |
| JWT (jsonwebtoken) | Stateless authentication, easy to verify and role-protect routes |
| bcryptjs | Secure password hashing with salt rounds |
| Nodemailer | Email delivery for tickets and notifications |
| qrcode | Server-side QR code generation embedded in tickets |
| Socket.io | Real-time bidirectional event-based communication |
| Multer | Multipart file upload handling for payment proofs |
| cors | Cross-origin resource sharing configuration |
| dotenv | Environment variable management |

## 🎯 Advanced Features Implemented

### Tier A (16 Marks)
1. **Hackathon Team Registration** — Team leaders create teams, invite via unique code, registration completes only when all members accept. Auto-generates tickets for all members.
2. **QR Scanner & Attendance Tracking** — Built-in QR scanner using device camera, marks attendance with timestamp, live dashboard, CSV export.

### Tier B (12 Marks)
1. **Organizer Password Reset Workflow** — Organizers request reset → Admin approves/rejects → system auto-generates new password.
2. **Real-Time Discussion Forum** — Socket.io powered forum on Event Details page with moderation, reactions, and threading.

### Tier C (2 Marks)
1. **Anonymous Feedback System** — Star ratings + text feedback post-event, organizers see aggregated stats.

## 📦 Project Structure

```
MERN-STACK/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── participantController.js
│   │   ├── organizerController.js
│   │   ├── adminController.js
│   │   ├── ticketController.js
│   │   ├── teamController.js
│   │   ├── forumController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   ├── Ticket.js
│   │   ├── Team.js
│   │   ├── ForumMessage.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── participantRoutes.js
│   │   ├── organizerRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── forumRoutes.js
│   │   └── feedbackRoutes.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── qrGenerator.js
│   │   └── generatePassword.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── TicketModal.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   └── FormBuilder.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── Onboarding.jsx
│   │   │   ├── participant/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── BrowseEvents.jsx
│   │   │   │   ├── EventDetails.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── organizer/
│   │   │   │   ├── OrgDashboard.jsx
│   │   │   │   ├── ManageEvent.jsx
│   │   │   │   ├── Participants.jsx
│   │   │   │   └── OrgProfile.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       └── ManageOrganizers.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── README.md
└── deployment.txt
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account (for Nodemailer)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@felicity.com
ADMIN_PASSWORD=admin123
```

## 🌐 Deployment

- **Frontend**: Vercel — [see deployment.txt]
- **Backend**: Render — [see deployment.txt]
- **Database**: MongoDB Atlas

## 👥 Contributors

- [santhoshkumar-git644](https://github.com/santhoshkumar-git644)
- [Sangameshwar-1](https://github.com/Sangameshwar-1)
