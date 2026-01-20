

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data)).catch(() => logout());
    api.get("/donations/my").then((res) => setDonations(res.data)).catch(() => {});
  }, []);

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <span style={styles.brand}>NGO Dashboard</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2>Welcome back, {user?.name}</h2>
          <p>Your contributions are making a real difference in the world.</p>
        </div>

        <div style={styles.layout}>
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Your Profile</h3>
              <p style={styles.text}><strong>Email:</strong> {user?.email}</p>
              <p style={styles.text}><strong>Member Type:</strong> {user?.role}</p>
              <button onClick={() => navigate("/donate")} style={styles.primaryBtn}>Donate Now</button>
            </div>
          </div>

          <div style={styles.main}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Recent Donations</h3>
              {donations.length === 0 ? (
                <p style={styles.mutedText}>No donations recorded yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} style={styles.tr}>
                        <td style={styles.td}>{new Date(d.created_at).toLocaleDateString()}</td>
                        <td style={styles.td}>₹{parseFloat(d.amount).toLocaleString()}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: d.status === "SUCCESS" ? "#dcfce7" : "#fee2e2", color: d.status === "SUCCESS" ? "#166534" : "#991b1b" }}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9fafb" },
  nav: { background: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "15px 0" },
  navContainer: { width: "90%", maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { fontSize: "20px", fontWeight: "bold", color: "#4f46e5" },
  content: { width: "90%", maxWidth: "1000px", margin: "40px auto" },
  welcomeCard: { background: "#4f46e5", color: "#ffffff", padding: "30px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  layout: { display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "25px" },
  card: { background: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  cardTitle: { marginTop: "0", marginBottom: "20px", fontSize: "18px", color: "#111827" },
  text: { fontSize: "14px", color: "#4b5563", margin: "10px 0" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "14px" },
  td: { padding: "12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
  primaryBtn: { width: "100%", marginTop: "15px", padding: "12px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  logoutBtn: { padding: "8px 16px", border: "1px solid #ef4444", color: "#ef4444", background: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }
};