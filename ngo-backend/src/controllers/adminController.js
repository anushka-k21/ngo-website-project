const pool = require("../config/db");

/**
 * View all users
 */
exports.getAllUsers = async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users"
  );
  res.json(result.rows);
};

/**
 * View all donations
 */
exports.getAllDonations = async (req, res) => {
  const result = await pool.query(
    `SELECT d.id, u.name, d.amount, d.status, d.created_at
     FROM donations d
     JOIN users u ON d.user_id = u.id
     ORDER BY d.created_at DESC`
  );
  res.json(result.rows);
};

/**
 * Admin dashboard stats
 */
exports.getStats = async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const donations = await pool.query(
    "SELECT COALESCE(SUM(amount),0) FROM donations WHERE status='SUCCESS'"
  );

  res.json({
    totalUsers: users.rows[0].count,
    totalDonationAmount: donations.rows[0].coalesce,
  });
};

// const pool = require("../config/db");
const { Parser } = require("json2csv");

/**
 * Filter users by role or date
 */
exports.getAllUsers = async (req, res) => {
  const { role, from, to } = req.query;

  let query = "SELECT id, name, email, role, created_at FROM users WHERE 1=1";
  const params = [];

  if (role) {
    params.push(role);
    query += ` AND role = $${params.length}`;
  }

  if (from) {
    params.push(from);
    query += ` AND created_at >= $${params.length}`;
  }

  if (to) {
    params.push(to);
    query += ` AND created_at <= $${params.length}`;
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
};

/**
 * Filter donations
 */
exports.getAllDonations = async (req, res) => {
  const { status } = req.query;

  let query = `
    SELECT d.id, u.name, d.amount, d.status, d.created_at
    FROM donations d
    JOIN users u ON d.user_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    params.push(status);
    query += ` AND d.status = $${params.length}`;
  }

  query += " ORDER BY d.created_at DESC";

  const result = await pool.query(query, params);
  res.json(result.rows);
};

exports.exportUsersCSV = async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users"
  );

  const parser = new Parser();
  const csv = parser.parse(result.rows);

  res.header("Content-Type", "text/csv");
  res.attachment("registrations.csv");
  return res.send(csv);
};
