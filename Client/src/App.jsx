import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Theme
import theme from "./theme/theme";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Homepage from "./pages/Dashboard/Homepage";

// Dashboard Pages
import Landing from "./pages/Dashboard/Landing";

// Cargo Module
import AwbPlanning from "./modules/Cargo/pages/AwbPlanning";
import AwbGenration from "./modules/Cargo/pages/AwbGenration";
import AwbDatabase from "./modules/Cargo/pages/AwbDatabase";
import CargoMgmt from "./modules/Cargo/pages/CargoMgmt";

// Airport Module
import AirportDatabase from "./modules/Airport/pages/AirportDatabase";
import AirportMgmt from "./modules/Airport/pages/AirportMgmt";
import AddAirport from "./modules/Airport/pages/AddAirport";

// Admin Module
import AccApproval from "./modules/Admin/pages/AccApproval";
import AdminDashboard from "./modules/Admin/pages/AdminDashboard";
import UserManagement from "./modules/Admin/pages/UserManagement";

// Contexts
import { AviProvider } from "./Context/AviContext";
import { CargoProvider } from "./modules/Cargo/context/CargoContext.jsx";

// Route Components
import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminRoute from "./Routes/AdminRoute";

// Cargo context wrapper component
const CargoContextWrapper = () => {
  return (
    <CargoProvider>
      <Outlet />
    </CargoProvider>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ToastContainer position="top-right" theme="dark" />

        <Routes>
          {/* Public Routes - No Context Required */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authentication Context Wrapper */}
          <Route
            element={
              <AviProvider>
                <Outlet />
              </AviProvider>
            }
          >
            {/* Protected Routes - Requires Authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Dashboard */}
                <Route path="/homepage" element={<Homepage />} />

                {/* Airport Management Routes */}
                <Route path="/airport-management" element={<AirportMgmt />} />
                <Route
                  path="/airport-management/airport-database"
                  element={<AirportDatabase />}
                />
                <Route
                  path="/airport-management/add-airport"
                  element={<AddAirport />}
                />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/approvals" element={<AccApproval />} />
                </Route>

                {/* Cargo Management Routes - With CargoContext */}
                <Route element={<CargoContextWrapper />}>
                  <Route path="/cargo-management" element={<CargoMgmt />} />
                  <Route
                    path="/cargo-management/awb-planning"
                    element={<AwbPlanning />}
                  />
                  <Route
                    path="/cargo-management/awb-generation"
                    element={<AwbGenration />}
                  />
                  <Route
                    path="/cargo-management/awb-database"
                    element={<AwbDatabase />}
                  />
             
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
