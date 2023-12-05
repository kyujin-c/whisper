// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Whisper from "./components/Whisper";
import Compare from "./components/Compare";
import "./css/App.css";
import "./css/whisper.css";
import "./css/compare.css";
import "./css/Login.css";
import "./css/Register.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login"  element={<Login />}/>
        <Route path="/whisper"  element={<Whisper />}/>
        <Route path="/compare"  element={<Compare />}/>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
