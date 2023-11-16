// Whisper.js

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Whisper = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://127.0.0.1:8000/api/logout/')
      .then((response) => {
        console.log(response.data); // Log the response for debugging
        // Handle success, if needed
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
        // Handle logout error, if needed
      });
  };

  return (
    <div>
      <h2>Whisper Page</h2>
      <p>Welcome to the Whisper Page!</p>

      {/* Add content for Whisper page */}
      
      <button type="button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Whisper;
