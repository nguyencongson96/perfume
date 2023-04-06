import React, { useContext } from "react";
import { Admin } from "../../Context/Admin";
import "./Header.css";

const Header = () => {
  // Get handleLogInLogOut function, checkTokenExist function and username variable from Context
  const { handleLogInLogOut, checkTokenExist, username } = useContext(Admin);
  return (
    <div className="header-admin">
      <h1 className="title">Administration</h1>
      <div className="user-info">
        <span className="username">
          {
            username // Show username to screen
          }
        </span>
        <span
          className="logout"
          onClick={() => {
            // Reset token and username to "" when user log out
            handleLogInLogOut("", "");
          }}
        >
          {
            checkTokenExist() ? "Log out" : "Log in" // Check if token exist in localstorage then show Log out, else Log in to screen
          }
        </span>
      </div>
    </div>
  );
};

export default Header;
