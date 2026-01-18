const pool = require("../config/db");

/**
 * Simulate payment verification
 * In real gateway → verify signature / webhook
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { donationId, paymentStatus } = req.body;

    if (!["SUCCESS", "FAILED"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const result = await pool.query(
      `UPDATE donations
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [paymentStatus, donationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({
      message: "Payment status updated",
      donation: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
