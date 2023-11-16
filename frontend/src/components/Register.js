import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const RegistrationForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    language: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);

      // Handle successful registration (redirect, show success message, etc.)
      //console.log(response.data);
      navigate('/')
    } catch (error) {
      // Handle validation errors
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        if (errors.password) {
          console.log(errors.password)
          setModalMessage("password");
          setShowModal(true);
        } 
        if (errors.email) {
          console.log(errors.email)
          setModalMessage("email");
          setShowModal(true);
        } 
        if (errors.username) {
          console.log(errors.username)
          setModalMessage("username");
          setShowModal(true);
        }

        // Display an alert or handle errors in your preferred way
        //alert(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        // Handle other errors (network, server, etc.)
        console.error('Registration failed:', error.message);
      }
    }
  };


  const closeModal = () => {
    setShowModal(false);
};
  return (


    <div style={{display:"flex" , justifyContent:"center", alignItems:"center"}}>
        <form onSubmit={handleSubmit} className='form-css'>
              {/* Your form fields here with onChange handlers */}

              <label>
                  Username:
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                  Password:
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                  Email:
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                  Last Name:
                  <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                  First Name:
                  <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                  Language:
                  <input type="text" name="language" value={formData.language} onChange={handleInputChange} />
                </label>

              {/* Other form fields go here */}

              <button type="submit">Register</button>
            </form>

            {showModal && (
                    <div className="modal-back">
                        <div className="modal">
                            <h3>{modalMessage}</h3>
                            <button onClick={closeModal}><b>닫기</b></button>
                        </div>
                    </div>
                )}
</div>
    
  );
};

export default RegistrationForm;
