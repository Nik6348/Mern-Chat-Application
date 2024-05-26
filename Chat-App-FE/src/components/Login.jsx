import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });
      alert("Login successful");
      navigate(`/chatlist/${username}`, { state: { username } });
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2 className="title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <button onClick={() => navigate("/register")} className="register-link">
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login;
