const db = require('../db');

const getDelegations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM delegations ORDER BY created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const createDelegation = async (req, res) => {
  const { delegator_id, delegate_id, reason, valid_from, valid_until } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO delegations (delegator_id, delegate_id, reason, valid_from, valid_until)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [delegator_id, delegate_id, reason, valid_from, valid_until || null]
    );
    res.status(201).json({ message: 'Delegation created.', delegation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getDelegations, createDelegation };