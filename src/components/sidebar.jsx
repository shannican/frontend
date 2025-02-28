import { useState } from "react";
import { FaUsers, FaUserTie, FaClipboardList, FaSignOutAlt, FaPlaneDeparture } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">LOGO</h2>
      <input type="text" placeholder="Search" className="search-bar" />
      <nav>
        <div className="section-title">Recruitment</div>
        <Link
          to="/candidates"
          className={`menu-item ${activePath === "/candidates" ? "active" : ""}`}
          onClick={() => setActivePath("/candidates")}
        >
          <FaUsers />
          <span>Candidates</span>
        </Link>

        <div className="section-title">Organization</div>
        <Link
          to="/employees"
          className={`menu-item ${activePath === "/employees" ? "active" : ""}`}
          onClick={() => setActivePath("/employees")}
        >
          <FaUserTie />
          <span>Employees</span>
        </Link>

        <Link
          to="/attendance"
          className={`menu-item ${activePath === "/attendance" ? "active" : ""}`}
          onClick={() => setActivePath("/attendance")}
        >
          <FaClipboardList />
          <span>Attendance</span>
        </Link>

        <Link
          to="/leave"
          className={`menu-item ${activePath === "/leave" ? "active" : ""}`}
          onClick={() => setActivePath("/leave")}
        >
          <FaPlaneDeparture />
          <span>Leaves</span>
        </Link>

        <div className="section-title">Others</div>
        <button className="menu-item logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
