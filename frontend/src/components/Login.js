import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const requestData = {
      username: username,
      password: password,
    };

    axios
      .post("http://127.0.0.1:8000/login/", requestData)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          // If login is successful, navigate to the Whisper page
          navigate("/whisper");
        } else {
          // If login fails, set an error message
          setErrorMessage("사용자명과 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        setErrorMessage("Failed to connect to the server. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <button type="submit">로그인</button>
        <p className="signup-text">
          계정이 없으신가요? <a href="/register">회원가입하기</a>
        </p>

        {/* Display error message if login fails */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
