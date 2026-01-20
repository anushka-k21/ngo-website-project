

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment gateway not loaded. Please refresh.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/payments/create-order", { amount });

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "NGO Donation",
        description: "Transaction ID: " + data.orderId,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", response);
            alert("Payment successful! Thank you for your donation.");
            navigate("/user");
          } catch {
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Unable to process payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={() => navigate("/user")} style={styles.backBtn}>← Back to Dashboard</button>
        <h2 style={styles.title}>Make a Contribution</h2>
        <p style={styles.description}>Select an amount to support our ongoing projects.</p>
        
        <div style={styles.inputWrapper}>
          <span style={styles.currency}>₹</span>
          <input
            style={styles.input}
            type="number"
            placeholder="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button style={styles.submitBtn} onClick={handleDonate} disabled={loading}>
          {loading ? "Processing..." : "Confirm Donation"}
        </button>
        
        <p style={styles.footerText}>Secure transaction powered by Razorpay</p>
      </div>
    </div>
  );
}

const styles = {
  page: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f3f4f6" },
  card: { width: "400px", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center" },
  backBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", marginBottom: "20px" },
  title: { margin: "10px 0", color: "#111827" },
  description: { color: "#6b7280", fontSize: "14px", marginBottom: "30px" },
  inputWrapper: { position: "relative", marginBottom: "30px" },
  currency: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "24px", fontWeight: "bold", color: "#111827" },
  input: { width: "100%", padding: "15px 15px 15px 45px", fontSize: "24px", fontWeight: "bold", border: "2px solid #e5e7eb", borderRadius: "8px", boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "15px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  footerText: { marginTop: "20px", fontSize: "12px", color: "#9ca3af" }
};