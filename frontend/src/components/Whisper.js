import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Whisper = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ko");
  const [audioFile, setAudioFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

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
    handleFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (file) => {
    if (file) {
      setAudioFile(file);
      setFileName(file.name);
    }
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
      setTranscript("");
      if (!audioFile) {
        console.error("No audio file selected.");
        return;
      }
      console.log(audioFile.name);

      const formData = new FormData();
      formData.append("audioFile", audioFile, audioFile.name);

      const response = await axios
        .post("http://127.0.0.1:8000/upload_audio/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
      <div className="top">
        <div className="title">
          <h2>Whisper Page</h2>
          <p>
            STT 모델을 체험해 보세요. 직접 음성을 녹음하거나 음성 파일을 업로드
            해주세요.
          </p>
        </div>
      </div>

      <div className="bottom">
        <div className="bottom-left">
          <div className="bottom-left-top">
            <div className="recording-section">
              <button className="start-recording" onClick={startRecording}>
                Start Recording
              </button>
              <button className="stop-recording" onClick={stopRecording}>
                Stop Recording
              </button>
            </div>

            <div className="transcript-line">
              <p>Transcript:</p>
              <div className="language-section">
                <label>Select Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="transcript-box">{transcript}</div>

          <div className="logout-section">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div
          className={`file-upload-section ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="upload-top">
            <label>Upload Audio File:</label>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={uploadAudioFile}>Upload</button>
          </div>

          <div className="upload-area">
            {fileName ? (
              <p>{fileName}</p>
            ) : (
              <p>
                {isDragging
                  ? "Drop the file here"
                  : "Drag and drop a file here"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whisper;
