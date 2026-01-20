

import { Navigate } from "react-router-dom";

export default function RoleRoute({ role, children }) {
  const userRole = localStorage.getItem("role");

  // Normalize both roles to lowercase for comparison
  if (!userRole || userRole.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}