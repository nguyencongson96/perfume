import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Admin = React.createContext();

export function AdminProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [productList, setProductList] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("user") || "");
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("add");
  const [productId, setProductId] = useState("");
  const redirect = useNavigate();

  function checkTokenExist() {
    const result = token === "" || token === null ? false : true;
    return result;
  }

  //Handle Route when click Log out Log in
  function handleLogInLogOut(token, user) {
    setToken(token);
    setUsername(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    redirect("/login");
  }

  return (
    <Admin.Provider
      value={{
        token,
        checkTokenExist,
        productList,
        setProductList,
        username,
        setUsername,
        handleLogInLogOut,
        showForm,
        setShowForm,
        formAction,
        setFormAction,
        productId,
        setProductId,
      }}
    >
      {children}
    </Admin.Provider>
  );
}
