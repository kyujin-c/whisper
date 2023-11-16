// Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {


    return (
        <div>
            <h2>Welcome to the Home Page</h2>
            {/* Add content and components for the home page */}

            <Link to="/login">여기 로그인 페이지로 가 </Link>
        </div>
    );
};

export default Home;
