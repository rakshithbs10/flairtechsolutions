// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { initializeDatabase } = require('./config/database');
const { ensureContainerExists } = require('./config/blobStorage');

const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Handled by React build
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/contact', contactRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'FlairTech Solutions API' });
});

// ─── Serve React Frontend (production) ───────────────────────────────────────
const FRONTEND_BUILD = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await initializeDatabase();
    await ensureContainerExists();
    app.listen(PORT, () => {
      console.log(`🚀 FlairTech Solutions server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
