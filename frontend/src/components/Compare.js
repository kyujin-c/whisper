import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { diffChars } from "diff";

const Compare = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const [script, setScript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ko");
  const [comparisonScore, setComparisonScore] = useState("");
  const [highlight, setHighlight] = useState([]);

  useEffect(() => {
    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    getScript();
    sendLanguageToBackend(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = async (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    // Send the selected language to the backend
    await sendLanguageToBackend(language);
  };

  const sendLanguageToBackend = async (language) => {
    try {
      await axios
        .post("http://127.0.0.1:8000/update_language/", { language })
        .then((response) => {
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error sending language to backend:", error);
    }
  };

  const getScript = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/check_accuracy/"
      );
      setScript(response.data.script);
    } catch (error) {
      console.error("Error getting script:", error);
    }
  };

  const handleLogout = () => {
    axios
      .post("http://127.0.0.1:8000/logout/")
      .then((response) => {
        console.log(response.data);
        isAuthenticated = false;
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
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      setTranscript("Audio is being transcribed...");

      const response = await axios.post(
        "http://127.0.0.1:8000/stop_recording/"
      );
      setTranscript(response.data.transcript);

      // Call highlightDifferences to highlight the differences
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handleCompare = () => {
    const differences = diffChars(script, transcript);

    const correctChars = differences.filter(
      (part) => !part.added && !part.removed
    );
    const totalChars = script.length;
    const accuracyPercentage =
      ((totalChars - correctChars.length) / totalChars) * 100;

    setComparisonScore(accuracyPercentage.toFixed(2));
  };

  const highlightDifferences = () => {
    const differences = diffChars(script, transcript);

    const highlightedText = differences.map((part, index) => {
      const color = part.added ? "red" : part.removed ? "green" : "black";
      return (
        <span key={index} style={{ color }}>
          {part.value}
        </span>
      );
    });

    setHighlight(highlightedText);
  };

  return (
    <div className="compare-container">
      <div className="top">
        <div className="title">
          <h2>Compare Page</h2>
          <p>
            STT 모델을 평가해보세요. 녹음 버튼을 누르고 아래의 텍스트를
            읽어주세요.
          </p>
        </div>
        <div />
      </div>

      <div className="bottom">
        <div className="bottom-left">
          <div className="bottom-left-top">
            <div className="recording-section">
              <button className="start-recording" onClick={startRecording}>
                Start Recording
              </button>
              <button className="start-recording" onClick={stopRecording}>
                Stop Recording
              </button>
              <button className="compare" onClick={handleCompare}>
                Compare Text
              </button>
            </div>

            <div className="transcript-line">
              <p>Script:</p>
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
          <div className="transcript-box">{script}</div>
          <p>Transcript:</p>
          <div className="transcript-box">{transcript}</div>
          <div className="logout-section">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="bottom-right">
          <div className="botton-right-top">
            <p className="score">Score: {comparisonScore}</p>
            <button className="highlight-button" onClick={highlightDifferences}>
              Check
            </button>
          </div>
          <div className="highlight-box">{highlight}</div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
