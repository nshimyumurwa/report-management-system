const db = require('../db');

const getUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, r.name as role, d.name as department
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY u.full_name ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getUsers };