// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const requestData = {
      username: username,
      password: password,
    };

    axios.post('http://127.0.0.1:8000/login/', requestData)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          // If login is successful, navigate to the Whisper page
          navigate('/whisper');
        } else {
          // If login fails, set an error message
          alert('Incorrect username or password');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>Login</button>
        <a href="/register">계정이 없으신가요? 회원가입하기</a>

        {/* Display error message if login fails */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
