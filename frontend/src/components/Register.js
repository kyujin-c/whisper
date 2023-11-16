// Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstname: '',
    lastname: '',
    language: '',
  });
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false); // State to handle redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axios.post('http://127.0.0.1:8000/register/', formData)
      .then((response) => {
        console.log(response.data);
        setMessage(response.data.message);

        // Set redirect to true upon successful registration
        setRedirect(true);
      })
      .catch((error) => {
        console.error('Registration error:', error);
        setMessage('Failed to register. Please check your information and try again.');
      });
  };

  // Use Navigate for redirection upon successful registration
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Registration Page</h2>
      <form>
      <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
        </label>
        <br />
        <label>
          Language:
          <input type="text" name="language" value={formData.language} onChange={handleChange} />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>Register</button>

        {/* Display registration message */}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
