// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Navbar.css";

export default function Navbar() {
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-link">🏠 Home</Link>
      </div>
      <div className="navbar-right">
        {userId ? (
          <>
            <Link to="/profile" className="nav-link">👤 Profile</Link>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">🔑 Login</Link>
        )}
      </div>
    </nav>
  );
}
