// Fallback Environment Variables for Render Manual Deployments
process.env.MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://salesangameshwar1_db_user:felicity%40123@cluster0.tf9t0ts.mongodb.net/felicity?retryWrites=true&w=majority";
process.env.MONGO_URI = process.env.MONGODB_URI;
process.env.JWT_SECRET = process.env.JWT_SECRET || "felicity_super_secret_jwt_key_2024_fallback";
process.env.CACHEX_HOST = process.env.CACHEX_HOST || "127.0.0.1";
process.env.CACHEX_PORT = process.env.CACHEX_PORT || "6379";
process.env.CLIENT_URL = process.env.CLIENT_URL || "https://mern-stack-eight-pearl.vercel.app";

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'Felicity API is running', timestamp: new Date() }));

// Socket.io events
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-forum', (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined forum: ${eventId}`);
  });

  socket.on('leave-forum', (eventId) => {
    socket.leave(eventId);
  });

  socket.on('typing', ({ eventId, userName }) => {
    socket.to(eventId).emit('user-typing', userName);
  });

  socket.on('stop-typing', ({ eventId }) => {
    socket.to(eventId).emit('user-stopped-typing');
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Admin seeding — create admin if not exists
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'Felicity',
        email: process.env.ADMIN_EMAIL || 'admin@felicity.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        participantType: undefined,
        isActive: true,
        onboardingComplete: true
      });
      console.log('✅ Admin account created');
    }
  } catch (error) {
    console.error('Admin seeding error:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 Felicity Server running on port ${PORT}`);
  await seedAdmin();
});
