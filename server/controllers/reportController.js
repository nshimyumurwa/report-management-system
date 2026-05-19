const db = require('../db');

// CREATE a report
const createReport = async (req, res) => {
  const { title, content, report_type, department_id, meeting_id, file_attachment } = req.body;
  const submitted_by = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO reports (title, content, report_type, status, submitted_by, department_id, meeting_id, file_attachment)
       VALUES ($1, $2, $3, 'draft', $4, $5, $6, $7) RETURNING *`,
      [title, content, report_type, submitted_by, department_id, meeting_id, file_attachment]
    );
    res.status(201).json({ message: 'Report created.', report: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET all reports
const getReports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.full_name as author, d.name as department_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       LEFT JOIN departments d ON r.department_id = d.id
       ORDER BY r.created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET a single report
const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT r.*, u.full_name as author, d.name as department_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET approvals for a report
const getReportApprovals = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT a.*, u.full_name as reviewer_name
       FROM approvals a
       LEFT JOIN users u ON a.reviewed_by = u.id
       WHERE a.report_id = $1
       ORDER BY a.decided_at ASC`,
      [id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// SUBMIT a report
const submitReport = async (req, res) => {
  const { id } = req.params;
  const { submitted_to, note } = req.body;

  try {
    // Get report title and submitter name
    const reportResult = await db.query(
      `SELECT r.title, u.full_name as submitter_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       WHERE r.id = $1`,
      [id]
    );
    const report = reportResult.rows[0];

    // Update report status
    await db.query(
      `UPDATE reports SET status = 'submitted', updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Record the submission
    await db.query(
      `INSERT INTO report_submissions (report_id, submitted_to, note)
       VALUES ($1, $2, $3)`,
      [id, submitted_to, note]
    );

    // Create notification for recipient
    await db.query(
      `INSERT INTO notifications (user_id, message, report_id)
       VALUES ($1, $2, $3)`,
      [submitted_to, `${report.submitter_name} submitted a report: "${report.title}"`, id]
    );

    res.status(200).json({ message: 'Report submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// APPROVE or REJECT a report
const reviewReport = async (req, res) => {
  const { id } = req.params;
  const { decision, comment, on_behalf_of } = req.body;
  const reviewed_by = req.user.id;

  try {
    // Get report details
    const reportResult = await db.query(
      `SELECT r.title, r.submitted_by, u.full_name as reviewer_name
       FROM reports r
       LEFT JOIN users u ON u.id = $1
       WHERE r.id = $2`,
      [reviewed_by, id]
    );
    const report = reportResult.rows[0];

    // Update report status
    await db.query(
      `UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2`,
      [decision, id]
    );

    // Record the approval
    await db.query(
      `INSERT INTO approvals (report_id, reviewed_by, decision, comment, on_behalf_of)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, reviewed_by, decision, comment, on_behalf_of]
    );

    // Notify the report author
    await db.query(
      `INSERT INTO notifications (user_id, message, report_id)
       VALUES ($1, $2, $3)`,
      [report.submitted_by, `Your report "${report.title}" was ${decision} by ${report.reviewer_name}`, id]
    );

    res.status(200).json({ message: `Report ${decision} successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createReport, getReports, getReportById, getReportApprovals, submitReport, reviewReport };