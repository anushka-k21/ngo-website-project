const pool = require("../config/db");

exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, amount, status, payment_gateway_id, created_at
       FROM donations
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};