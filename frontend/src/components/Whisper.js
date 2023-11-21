import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Whisper = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleLogout = () => {
    axios
      .post("http://127.0.0.1:8000/logout/")
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const startRecording = async () => {
    try {
      setTranscript('')
      await axios.post("http://127.0.0.1:8000/start_recording/");
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      await axios
        .post("http://127.0.0.1:8000/stop_recording/")
        .then((response) => {
          setIsRecording(false);
          setTranscript(response.data.transcript);
        });
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  return (
    <div>
      <h2>Whisper Page</h2>
      <p>Welcome to the Whisper Page!</p>

      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>

      <p>Transcript: {transcript}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Whisper;
