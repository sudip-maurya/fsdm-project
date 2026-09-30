const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const projectRoutes = require('./routes/projectRoutes');

const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Uploads static directory safe path resolution
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(uploadsDir));
app.use('/api/uploads', express.static(uploadsDir));

// Fallback to process.cwd() uploads directory if different (e.g. root run)
const cwdUploadsDir = path.join(process.cwd(), 'uploads');
if (cwdUploadsDir !== uploadsDir && fs.existsSync(cwdUploadsDir)) {
  app.use('/uploads', express.static(cwdUploadsDir));
  app.use('/api/uploads', express.static(cwdUploadsDir));
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    console.log('DATABASE NAME:', mongoose.connection.name);
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Open Repository Backend is Running 🚀');
});

// Health check / warm-up endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Standard API Routes & Aliases (handles requests with or without /api prefix)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/departments', departmentRoutes);
app.use('/departments', departmentRoutes);

app.use('/api/subjects', subjectRoutes);
app.use('/subjects', subjectRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/reports', reportRoutes);
app.use('/reports', reportRoutes);


// Express Error Handling Middleware for Multer and route errors
app.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 10MB limit.',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'An error occurred during file upload.',
    });
  }
  next();
});

// Start Server (Always LAST)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});