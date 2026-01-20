import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Donate from "./pages/donate";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";

import PrivateRoute from "./routes/privateRoute";
import RoleRoute from "./routes/roleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <RoleRoute role="USER">
                <UserDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Donate */}
        <Route
          path="/donate"
          element={
            <PrivateRoute>
              <RoleRoute role="USER">
                <Donate />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute role="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
