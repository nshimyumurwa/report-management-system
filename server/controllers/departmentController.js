const db = require('../db');

// GET all departments
const getDepartments = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM departments ORDER BY created_at ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// CREATE a department
const createDepartment = async (req, res) => {
  const { name, type } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO departments (name, type) VALUES ($1, $2) RETURNING *`,
      [name, type]
    );
    res.status(201).json({ message: 'Department created.', department: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getDepartments, createDepartment };