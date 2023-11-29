// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Whisper from "./components/Whisper";
import Compare from "./components/Compare";
import "./css/App.css";
import "./css/whisper.css";
import "./css/compare.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set isAuthenticated to true when the user logs in
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />
          }
        />
        <Route
          path="/whisper"
          element={<Whisper isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/compare"
          element={<Compare isAuthenticated={isAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
