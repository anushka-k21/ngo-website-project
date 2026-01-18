// import api from "../services/api";

// export default function Login() {
//   const handleLogin = async () => {
//     const res = await api.post("/auth/login", {
//       email,
//       password,
//     });

//     localStorage.setItem("token", res.data.token);
//     window.location = res.data.role === "ADMIN" ? "/admin" : "/user";
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

import { useState } from "react";
import { apiRequest } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await apiRequest(
      "/auth/login",
      "POST",
      { email, password }
    );

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      alert("Login successful");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
