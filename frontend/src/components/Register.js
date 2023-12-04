import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    language: "",
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
      await axios.post(
        "http://127.0.0.1:8000/register/",
        formData
      );

      // Handle successful registration (redirect, show success message, etc.)
      //console.log(response.data);
      navigate("/");
    } catch (error) {
      // Handle validation errors
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        if (errors.password) {
          console.log(errors.password);
          setModalMessage(
            "숫자, 영문, 특수시호(!, & 등)를 조합한 여덟 자리 이상의 비밀번호를 입력하세요."
          );
          setShowModal(true);
        }
        if (errors.email) {
          console.log(errors.email);
          setModalMessage("이미 사용중인 이메일 주소입니다.");
          setShowModal(true);
        }
        if (errors.username) {
          console.log(errors.username);
          setModalMessage("이미 사용중인 사용자명입니다.");
          setShowModal(true);
        }

        // Display an alert or handle errors in your preferred way
        //alert(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        // Handle other errors (network, server, etc.)
        console.error("Registration failed:", error.message);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [isUsernameUnique, setIsUsernameUnique] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const checkUsernameUnique = async () => {
    if (!formData.username) {
      setUsernameError("Username is required");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/check_unique_username/?username=${formData.username}`
      );
      setIsUsernameUnique(response.data.is_unique);
      setUsernameError(null); // Clear any previous error
    } catch (error) {
      console.error("Error checking username uniqueness:", error.message);
    }
  };

  return (
    <>
      <div className="register-main">
        <form onSubmit={handleSubmit} className="form-css">
          <div className="form-item">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <button
              type="button"
              onClick={checkUsernameUnique}
              className="check-user-btn"
            >
              Check Username
            </button>
            {usernameError && <span>{usernameError}</span>}
            {isUsernameUnique !== null && (
              <span>
                {isUsernameUnique
                  ? "사용 가능한 사용자명입니다."
                  : "이미 사용 중인 사용자명입니다."}
              </span>
            )}
          </div>

          <div className="form-item">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <span>
              (숫자, 영문, 특수시호를 조합한 여덟 자리 이상의 비밀번호를
              입력하세요.)
            </span>
          </div>

          <div className="form-item">
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-item">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-item">
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-item">
            <label> Language:</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-item">
            <label></label>
            <div className="submit-btn-space">
              <button type="submit">
                Register
              </button>
            </div>
          </div>
        </form>

        {showModal && (
          <div className="modal-back">
            <div className="modal">
              <h3>{modalMessage}</h3>
              <button onClick={closeModal}>
                <b>닫기</b>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegistrationForm;
