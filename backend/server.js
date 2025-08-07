const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./database/config.js");
const authRoutes = require('./routes/authRoute.js');
const disasterRoutes = require('./routes/disaster.js');
const userRoutes = require('./routes/user'); 
const sosRoutes = require('./routes/sos');
const adminRoute=require('./routes/adminDisaster.js')
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken'); // ✅

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // ✅ Adjust this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io); // Make io available via req.app.get('io')
connectDB();

app.use(cors());
app.use(express.json());

/** ✅ Authenticate each socket connection */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

  if (!token) return next(new Error('Authentication error: No token provided'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user to socket
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const user = socket.user;
  console.log(`🟢 Socket connected (${user.role}):`, socket.id);

  // ✅ Join user rooms
  if (user.role === 'admin') {
    socket.join('admins'); // Admin broadcast room
    console.log(` Admin joined room: admins`);
  } else {
    // Join a room specific to this user
    socket.join(`user_${user.id}`);
    console.log(`👤 User joined room: user_${user.id}`);
  }

  socket.on('disconnect', () => {
    console.log(`🔴 Disconnected:`, socket.id);
  });
});

// REST API Routes
app.use('/api/authenticate', authRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/admin',adminRoute)
// ❇️ Base health check route (optional)
app.get('/', (req, res) => {
  res.send('RescueNow Server Running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
