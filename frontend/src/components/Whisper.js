import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Whisper = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ko");
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    // Handle language update when the component mounts
    sendLanguageToBackend(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = async (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    // Send the selected language to the backend
    await sendLanguageToBackend(language);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const sendLanguageToBackend = async (language) => {
    try {
      const response = await axios
        .post("http://127.0.0.1:8000/update_language/", { language })
        .then((response) => {
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error sending language to backend:", error);
    }
  };

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
      setTranscript("");
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

  const uploadAudioFile = async () => {
    try {
      setTranscript("")
      if (!audioFile) {
        console.error("No audio file selected.");
        return;
      }
      console.log(audioFile.name)

      const formData = new FormData();
      formData.append("audioFile", audioFile, audioFile.name);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload_audio/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setTranscript(response.data.transcript);
        console.log(response.data); // Handle the response as needed
      });
    } catch (error) {
      console.error("Error uploading audio file:", error);
    }
  };

  return (
    <div className="whisper-container">
      <h2>Whisper Page</h2>
      <p>Welcome to the Whisper Page!</p>

      <div className="language-section">
        <label>Select Language:</label>
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="file-upload-section">
        <label>Upload Audio File:</label>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={uploadAudioFile}>Upload</button>
      </div>

      <div className="recording-section">
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>

      <div className="transcript-section">
        <p>Transcript: {transcript}</p>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Whisper;
