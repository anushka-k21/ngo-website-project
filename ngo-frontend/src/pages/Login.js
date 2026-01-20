
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (activeTab === "register") {
        await api.post("/auth/register", { name, email, password });
        alert("Registration successful. You can now log in.");
        setActiveTab("login");
        return;
      }

      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      const userRole = res.data.user.role.toLowerCase();
      navigate(res.data.user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>NGO Connect</h2>
          <p style={styles.subtitle}>Supporting communities through technology</p>
        </div>

        <div style={styles.tabs}>
          <button 
            style={{ ...styles.tab, ...(activeTab === "login" ? styles.activeTab : {}) }} 
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button 
            style={{ ...styles.tab, ...(activeTab === "register" ? styles.activeTab : {}) }} 
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div style={styles.form}>
          {activeTab === "register" && (
            <input
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #4f46e5, #22c55e)" },
  card: { width: "380px", padding: "40px", borderRadius: "12px", background: "#ffffff", boxShadow: "0 15px 35px rgba(0,0,0,0.2)" },
  header: { textAlign: "center", marginBottom: "30px" },
  title: { margin: "0", fontSize: "24px", color: "#111827" },
  subtitle: { color: "#6b7280", fontSize: "14px", marginTop: "5px" },
  tabs: { display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "4px", marginBottom: "25px" },
  tab: { flex: 1, padding: "10px", border: "none", background: "none", cursor: "pointer", fontWeight: "600", color: "#4b5563", borderRadius: "6px" },
  activeTab: { background: "#ffffff", color: "#4f46e5", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "12px", background: "#22c55e", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }
};