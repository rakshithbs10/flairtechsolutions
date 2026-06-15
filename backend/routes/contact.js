// routes/contact.js
const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { body, validationResult } = require('express-validator');

// POST /api/contact — save contact message to Azure SQL
router.post('/',
  [
    body('fullName').notEmpty().trim().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { fullName, email, phone, subject, message } = req.body;
      const pool = await getPool();

      await pool.request()
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.NVarChar, email)
        .input('phone', sql.NVarChar, phone || null)
        .input('subject', sql.NVarChar, subject || null)
        .input('message', sql.NVarChar, message)
        .query(`
          INSERT INTO ContactMessages (fullName, email, phone, subject, message)
          VALUES (@fullName, @email, @phone, @subject, @message)
        `);

      res.status(201).json({
        success: true,
        message: 'Thank you for contacting us! We will get back to you within 1-2 business days.',
      });
    } catch (err) {
      console.error('POST /contact error:', err);
      res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
  }
);

module.exports = router;
