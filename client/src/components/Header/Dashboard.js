import React, { useState } from "react";
//import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import KlocLogo from '../../assets/images/Kloc-logo.jpg'
//import logo from "../../../assets/Images/kloc-white-logo.png";
import Tooltip from "@mui/material/Tooltip";
//import { GiHamburgerMenu } from "react-icons/gi";
import "../../Styles/Header.scss";

function Dashboard() {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); // Mobile menu visibility
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    let token = localStorage.getItem("token");
    if (window.confirm("Are you sure to logout?")) {
      if (token) {
        localStorage.clear();
        navigate("/login"); // Redirect user to the login page
        window.location.reload();
      }
    }
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        {/* logo */}
        <Tooltip title="Logout" placement="top">
          <img
            src={KlocLogo}
            alt="logo"
            className="logo"
            onClick={handleLogout}
          />
          <p className="header-heading">CRM</p>
        </Tooltip>
      </div>
      <div className="profile-logout-container">
        <p
          onClick={() => navigate("/admin_profile")}
          className="header-navbar-link"
        >
          Welcome <Tooltip title={localStorage.getItem('userRole')} placement="top">
            <span className="admin-text">{localStorage.getItem('userName')}</span>
          </Tooltip>!
        </p>
        <Tooltip title="Logout">
          <p onClick={handleLogout} className="logout">
            {/* <RiLogoutCircleRLine size={16} /> */}
          </p>
        </Tooltip>
      </div>
    </div>
  );
}

export default Dashboard;
