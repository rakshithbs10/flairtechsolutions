// routes/jobs.js
const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');
const { body, validationResult } = require('express-validator');

// GET /api/jobs — list all active job listings
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id, title, description, location, jobType, requirements, salary, postedDate
      FROM JobListings
      WHERE isActive = 1
      ORDER BY postedDate DESC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('GET /jobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch job listings' });
  }
});

// GET /api/jobs/:id — single job
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('SELECT * FROM JobListings WHERE id = @id AND isActive = 1');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('GET /jobs/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
});

// POST /api/jobs — create job (admin-only; protect with middleware in production)
router.post('/',
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('location').notEmpty().trim(),
    body('jobType').notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { title, description, location, jobType, requirements, salary } = req.body;
      const pool = await getPool();
      const result = await pool.request()
        .input('title', sql.NVarChar, title)
        .input('description', sql.NVarChar, description)
        .input('location', sql.NVarChar, location)
        .input('jobType', sql.NVarChar, jobType)
        .input('requirements', sql.NVarChar, requirements || null)
        .input('salary', sql.NVarChar, salary || null)
        .query(`
          INSERT INTO JobListings (title, description, location, jobType, requirements, salary)
          OUTPUT INSERTED.id
          VALUES (@title, @description, @location, @jobType, @requirements, @salary)
        `);

      res.status(201).json({ success: true, data: { id: result.recordset[0].id } });
    } catch (err) {
      console.error('POST /jobs error:', err);
      res.status(500).json({ success: false, message: 'Failed to create job listing' });
    }
  }
);

// DELETE /api/jobs/:id — soft delete
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('UPDATE JobListings SET isActive = 0 WHERE id = @id');
    res.json({ success: true, message: 'Job listing removed' });
  } catch (err) {
    console.error('DELETE /jobs/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
});

module.exports = router;
