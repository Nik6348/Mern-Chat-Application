import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatlist/:userId" element={<ChatList />} />
        <Route path="/chat/:userId/:contactId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
