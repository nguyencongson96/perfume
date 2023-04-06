import Login from "./components/Admin/Login/Login";
import Root from "./components/Admin/Root/Root";
import Header from "./components/Admin/Header/Header";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "./components/Context/Admin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={
            <AdminProvider>
              <Login />
            </AdminProvider>
          }
        />
        <Route
          path="*"
          element={
            <AdminProvider>
              <Header />
              <Root />
            </AdminProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
