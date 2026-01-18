const pool = require("../config/db");

/**
 * Create a donation attempt (status = PENDING)
 */
exports.createDonation = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const result = await pool.query(
      `INSERT INTO donations (user_id, amount, status)
       VALUES ($1, $2, 'PENDING')
       RETURNING *`,
      [userId, amount]
    );

    res.status(201).json({
      message: "Donation initiated",
      donation: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get donation history of logged-in user
 */
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, amount, status, created_at
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
