import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import ChangePassword from "./pages/ChangePassword";

export default function AppRoutes() {

  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/report"
        element={<Report />}
      />

      <Route
        path="/change-password"
        element={<ChangePassword />}
      />

    </Routes>
  );
}
