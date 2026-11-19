import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const staff = user.role === "admin";

  async function handleLogout() {
    try {
      await api.post("/api/logout/");
    } catch (err) {
      // Still clear the token if the server is already down.
    }
    logout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <div className="brand" onClick={() => navigate(staff ? "/admin" : "/")}>
        <strong>Piki Ora</strong>
        <span>Medical Centre</span>
      </div>
      <nav>
        {staff ? (
          <>
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/doctors">Doctors</NavLink>
            <NavLink to="/admin/slots">Times</NavLink>
            <NavLink to="/admin/bookings">Bookings</NavLink>
            <NavLink to="/admin/patients">Patients</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/doctors">Doctors</NavLink>
            <NavLink to="/appointments">My visits</NavLink>
          </>
        )}
        <button type="button" className="linkish" onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
}

export default Navbar;
