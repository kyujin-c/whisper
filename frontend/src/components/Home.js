import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h2>음성 인식(STT) 체험하기</h2>
      <p>환영합니다! Whisper 앱으로 간편하게 음성을 녹음하고 텍스트로 변환해보세요.
        다양한 언어를 지원하여 언제 어디서나 편리하게 사용할 수 있습니다.</p>
      {/* Add more content and components for the home page */}

      <Link to="/login" className="home-link">
        로그인
      </Link>
    </div>
  );
};

export default Home;
