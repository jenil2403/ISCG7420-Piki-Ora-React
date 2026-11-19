import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DoctorsPage from "./pages/DoctorsPage";
import BookPage from "./pages/BookPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import EditAppointmentPage from "./pages/EditAppointmentPage";
import AdminHome from "./pages/AdminHome";
import AdminDoctors from "./pages/AdminDoctors";
import AdminSlots from "./pages/AdminSlots";
import AdminBookings from "./pages/AdminBookings";
import AdminPatients from "./pages/AdminPatients";

function App() {
  const { user } = useAuth();

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/doctors" element={<PrivateRoute><DoctorsPage /></PrivateRoute>} />
        <Route path="/book/:doctorId" element={<PrivateRoute><BookPage /></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
        <Route path="/appointments/:id/edit" element={<PrivateRoute><EditAppointmentPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminHome /></PrivateRoute>} />
        <Route path="/admin/doctors" element={<PrivateRoute adminOnly><AdminDoctors /></PrivateRoute>} />
        <Route path="/admin/slots" element={<PrivateRoute adminOnly><AdminSlots /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute adminOnly><AdminBookings /></PrivateRoute>} />
        <Route path="/admin/patients" element={<PrivateRoute adminOnly><AdminPatients /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
