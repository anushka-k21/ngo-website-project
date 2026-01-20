const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STEP 1: Create Razorpay Order + Donation (PENDING)
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId },
    });

    // Save to Database using your specific column: payment_gateway_id
    await pool.query(
      `INSERT INTO donations (user_id, amount, status, payment_gateway_id)
       VALUES ($1, $2, 'PENDING', $3)
       RETURNING *`,
      [userId, amount, order.id]
    );

    res.json({
      success: true,
      orderId: order.id,
      amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("DEBUG ERROR:", err);
    res.status(500).json({ message: "Unable to create order", details: err.message });
  }
};

// STEP 2: Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await pool.query(
        `UPDATE donations SET status='FAILED' WHERE payment_gateway_id=$1`,
        [razorpay_order_id]
      );
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update the record with SUCCESS and the actual payment ID
    const result = await pool.query(
      `UPDATE donations
       SET status='SUCCESS', updated_at=CURRENT_TIMESTAMP
       WHERE payment_gateway_id=$1
       RETURNING *`,
      [razorpay_order_id]
    );

    res.json({
      message: "Payment verified successfully",
      donation: result.rows[0],
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};