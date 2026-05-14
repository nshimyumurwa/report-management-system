const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');
const path = require('path');

// POST /api/upload
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    message: 'File uploaded successfully.',
    fileUrl,
    originalName: req.file.originalname
  });
});

module.exports = router;