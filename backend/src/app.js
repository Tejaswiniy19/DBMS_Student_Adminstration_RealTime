require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const admissionRoutes = require('./routes/admissions');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');
const reportRoutes = require('./routes/reports');

const app = express();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(morgan('tiny'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

app.use(limiter);
app.use(
  '/uploads',
  express.static(uploadDir, {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  })
);app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;
