 const db = require('../db');

// GET all roles
const getRoles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM roles ORDER BY access_level ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// CREATE a role
const createRole = async (req, res) => {
  const { name, access_level, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO roles (name, access_level, description) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, access_level, description]
    );
    res.status(201).json({ message: 'Role created.', role: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getRoles, createRole };