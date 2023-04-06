import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Admin } from "../../Context/Admin";
import "./login.css";

const Login = () => {
  // Declare state variables for username, password, and notification
  const { username, setUsername, handleLogInLogOut } = useContext(Admin);
  const [password, setPassword] = useState("");
  const [noti, setNoti] = useState("");
  const redirect = useNavigate();

  // Handle submit event for login form
  const handleSubmit = async (event) => {
    event.preventDefault();
    //Get Account input from user
    const account = { user: username, pwd: password };
    console.log(account);
    //Call API to compare account input to account List
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
    console.log(res);
    //Get status of response
    const status = res.status;
    const msg = await res.json();
    console.log(msg);
    // Check if status is bad then show Noti of message received from server
    if (status === 400 || status === 401) {
      setNoti(Object.values(msg)[0]);
    } else {
      //In case status is good, login successfully, then set Noti to "", set Token, and username based on accessToken received from server, and finally redirect to homepage
      setNoti("");
      handleLogInLogOut(`Bearer ${msg.accessToken}`, msg.username);
      // return redirect("/");
    }
  };

  // Render login form
  return (
    <div className="login">
      <h1 className="login-header">Login</h1>
      <form className="login-form">
        <div className="username-input input">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="pwd-input input">
          <label htmlFor="pwd">Password</label>
          <input
            id="pwd"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button id="submit" className="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <div className="noti">{noti}</div>
    </div>
  );
};

export default Login;
