// routes/applications.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getPool, sql } = require('../config/database');
const { uploadResume } = require('../config/blobStorage');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

// Multer: store in memory, max 5MB, allow PDF/DOC/DOCX only
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, or DOCX files are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/applications — submit a job application (requires auth)
router.post('/',
  authenticate,
  upload.single('resume'),
  [
    body('phone').optional().trim(),
    body('jobTitle').optional().trim(),
    body('coverLetter').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { phone, jobTitle, jobId, coverLetter } = req.body;

      // Use authenticated user's info
      const fullName = req.user.fullName;
      const email = req.user.email;
      const userId = req.user.id;

      let resumeUrl = null;
      let resumeFileName = null;

      if (req.file) {
        const uploaded = await uploadResume(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        resumeUrl = uploaded.url;
        resumeFileName = uploaded.originalFileName;
      }

      const pool = await getPool();

      // Prevent duplicate applications for same job
      if (jobId) {
        const duplicate = await pool.request()
          .input('userId', sql.Int, userId)
          .input('jobId', sql.Int, parseInt(jobId))
          .query('SELECT id FROM Applications WHERE userId = @userId AND jobId = @jobId');

        if (duplicate.recordset.length > 0) {
          return res.status(409).json({ success: false, message: 'You have already applied for this position.' });
        }
      }

      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('jobId', sql.Int, jobId ? parseInt(jobId) : null)
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.NVarChar, email)
        .input('phone', sql.NVarChar, phone || null)
        .input('jobTitle', sql.NVarChar, jobTitle || null)
        .input('resumeUrl', sql.NVarChar, resumeUrl)
        .input('resumeFileName', sql.NVarChar, resumeFileName)
        .input('coverLetter', sql.NVarChar, coverLetter || null)
        .query(`
          INSERT INTO Applications (userId, jobId, fullName, email, phone, jobTitle, resumeUrl, resumeFileName, coverLetter)
          OUTPUT INSERTED.id
          VALUES (@userId, @jobId, @fullName, @email, @phone, @jobTitle, @resumeUrl, @resumeFileName, @coverLetter)
        `);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully! We will be in touch.',
        data: { id: result.recordset[0].id },
      });
    } catch (err) {
      console.error('POST /applications error:', err);
      res.status(500).json({ success: false, message: 'Failed to submit application. Please try again.' });
    }
  }
);

// GET /api/applications/my — get logged-in user's applications
router.get('/my', authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT
          a.id, a.jobTitle, a.resumeFileName, a.coverLetter,
          a.status, a.appliedDate, a.phone,
          j.title as listedJobTitle, j.location, j.jobType
        FROM Applications a
        LEFT JOIN JobListings j ON a.jobId = j.id
        WHERE a.userId = @userId
        ORDER BY a.appliedDate DESC
      `);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('GET /applications/my error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only PDF')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;
