const db = require('../db');

// GET notifications for logged in user
const getNotifications = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await db.query(
      `SELECT n.*, r.title as report_title
       FROM notifications n
       LEFT JOIN reports r ON n.report_id = r.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 20`,
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// MARK notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `UPDATE notifications SET is_read = true WHERE id = $1`,
      [id]
    );
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// MARK all notifications as read
const markAllAsRead = async (req, res) => {
  const user_id = req.user.id;
  try {
    await db.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1`,
      [user_id]
    );
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };