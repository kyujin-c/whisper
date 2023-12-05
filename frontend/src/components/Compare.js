import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { diffChars } from "diff";

const Compare = () => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const [script, setScript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "ko"
  );
  const [comparisonScore, setComparisonScore] = useState("");
  const [highlight, setHighlight] = useState([]);

  useEffect(() => {
    // If not authenticated, redirect to the login page
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
    }

    const handlePopstate = () => {
      // Clear selectedLanguage from localStorage when the user clicks the back button
      localStorage.removeItem("selectedLanguage");
    };

    // Attach the event listener for the popstate event
    window.addEventListener("popstate", handlePopstate);

    // Cleanup function to remove the event listener when leaving the page
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [navigate]);

  useEffect(() => {
    getScript();
    sendLanguageToBackend(selectedLanguage);
  }, [selectedLanguage]);

  // Save selectedLanguage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
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
      console.log("set language is:", response.data.lang);
    } catch (error) {
      console.error("Error getting script:", error);
    }
  };

  const handleLogout = () => {
    axios
      .post("http://127.0.0.1:8000/logout/")
      .then((response) => {
        console.log(response.data);
        localStorage.clear();
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

    // Extract strings from differences that are added or removed
    const correctChars = differences
      .filter((part) => !part.added && !part.removed)
      .map((part) => part.value.trim("")); // Ignore whitespace here

    // Calculate the total length of the different characters
    const totalLength = correctChars.reduce((acc, str) => acc + str.length, 0);

    const totalChars = script.length;

    // Calculate the comparison score
    const accuracyPercentage = (totalLength / totalChars) * 100;

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
      <div className="recording-section">
        <div className="recording-buttons">
          <button className="start-recording" onClick={startRecording}>
            Start Recording
          </button>
          <button className="start-recording" onClick={stopRecording}>
            Stop Recording
          </button>
          <button
            className="compare"
            onClick={() => {
              handleCompare();
              highlightDifferences();
            }}
          >
            Compare Text
          </button>
        </div>
      </div>

      <div className="bottom">
        <div className="bottom-left">
          <div className="bottom-left-top"></div>
          <div className="transcript-line">
            <p>Script:</p>
            <div className="language-section">
              <p>Select Language:</p>
              <select value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="ko">
                  한국어
                </option>
                <option value="en">
                  English
                </option>
              </select>
            </div>
          </div>
          <div className="transcript-box">{script}</div>
          <p className="transcript-title"> Transcript:</p>
          <div className="transcript-box">{transcript}</div>
        </div>
        <div className="bottom-right">
          <div className="botton-right-top">
            <p className="score">Score: {comparisonScore}</p>
          </div>
          <div className="highlight-box">{highlight}</div>
        </div>
      </div>
      <div className="logout-section">
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Compare;
