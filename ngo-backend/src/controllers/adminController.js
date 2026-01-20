const pool = require("../config/db");
const { Parser } = require("json2csv");

// 1. Filter and View Users
exports.getAllUsers = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Filter and View Donations
exports.getAllDonations = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Export Users to CSV
exports.exportUsersCSV = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    const parser = new Parser();
    const csv = parser.parse(result.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("registrations.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Admin Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const donations = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM donations WHERE status='SUCCESS'"
    );

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalDonationAmount: parseFloat(donations.rows[0].total)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};