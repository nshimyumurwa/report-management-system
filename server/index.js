const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Routes
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reports', reportRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: '✅ RMS Backend is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});