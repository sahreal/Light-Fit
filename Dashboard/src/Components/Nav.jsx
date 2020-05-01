import React from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import sessions from "../helpers/userLogin.js";

const Nav = () => {
  const history = useHistory();

  const logoutUser = async () => {
    let isLoggedOut = await sessions.userLogout();
    isLoggedOut ? history.push("/login") : "";
  };

  const location = window.location.pathname;
  return (
    <div className="nav_bar">
      <div className="nav_logo">
        <img src="images/transparent.png" className="nav_logo_image" />
        <span className="header">Dashboard</span>
      </div>
      <div className="logout">
        {location !== "/login" ? (
          <p className="logout_button" onClick={logoutUser}>
            logout
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Nav;
