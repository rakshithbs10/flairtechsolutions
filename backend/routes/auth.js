// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getPool, sql } = require('../config/database');
const { authenticate } = require('../middleware/auth');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
router.post('/register',
  [
    body('fullName').notEmpty().trim().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, password, phone } = req.body;

    try {
      const pool = await getPool();

      // Check if email already exists
      const existing = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT id FROM Users WHERE email = @email');

      if (existing.recordset.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const result = await pool.request()
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.NVarChar, email)
        .input('passwordHash', sql.NVarChar, passwordHash)
        .input('phone', sql.NVarChar, phone || null)
        .query(`
          INSERT INTO Users (fullName, email, passwordHash, phone)
          OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.email
          VALUES (@fullName, @email, @passwordHash, @phone)
        `);

      const user = result.recordset[0];
      const token = signToken(user);

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
      });
    } catch (err) {
      console.error('POST /auth/register error:', err);
      res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT id, fullName, email, passwordHash FROM Users WHERE email = @email');

      if (result.recordset.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const user = result.recordset[0];
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = signToken(user);

      res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
      });
    } catch (err) {
      console.error('POST /auth/login error:', err);
      res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
  }
);

// GET /api/auth/me — get current user from token
router.get('/me', authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, fullName, email, phone, createdAt FROM Users WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user: result.recordset[0] });
  } catch (err) {
    console.error('GET /auth/me error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
});

module.exports = router;
