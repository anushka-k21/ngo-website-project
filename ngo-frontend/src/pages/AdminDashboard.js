import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sRes, uRes, dRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/donations")
        ]);
        setStats(sRes.data);
        setUsers(uRes.data);
        setDonations(dRes.data);
      } catch (err) {
        localStorage.clear();
        navigate("/");
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleExport = async () => {
    try {
      const response = await api.get("/admin/export-users", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ngo_registrations.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Export failed");
    }
  };

  if (!stats) return <div style={styles.loading}>Initializing Dashboard...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Admin Command Center</h2>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* Requirements: Aggregated Stats */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <p>Total Registrations</p>
            <h3>{stats.totalUsers}</h3>
          </div>
          <div style={styles.statCard}>
            <p>Donations Received</p>
            <h3>₹{parseFloat(stats.totalDonationAmount).toLocaleString()}</h3>
          </div>
        </div>

        {/* Requirement: Registration Management */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>User Management</h3>
            <button onClick={handleExport} style={styles.exportBtn}>Export Data</button>
          </div>
          <input 
            style={styles.filterInput} 
            placeholder="Search by email..." 
            onChange={(e) => setUserSearch(e.target.value)} 
          />
          <table style={styles.table}>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Requirement: Donation Management */}
        <section style={styles.section}>
          <h3>Detailed Donation Records</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Donor Name</th><th>Amount</th><th>Status</th><th>Date & Time</th></tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} style={styles.tr}>
                  <td>{d.user_name}</td>
                  <td>₹{d.amount}</td>
                  <td style={{ color: d.status === 'SUCCESS' ? 'green' : 'red', fontWeight: 'bold' }}>{d.status}</td>
                  <td>{new Date(d.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f3f4f6", padding: "40px 0" },
  container: { maxWidth: "1000px", margin: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  statGrid: { display: "flex", gap: "20px", marginBottom: "30px" },
  statCard: { flex: 1, padding: "25px", background: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  section: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  filterInput: { width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd" },
  exportBtn: { background: "#4f46e5", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  logoutBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }
};