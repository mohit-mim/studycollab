import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have a separate CSS file for Home component styles

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the Virtual Study Platform</h1>
                <p>Your one-stop solution for collaborative learning and coding practice.</p>
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </header>
            <section className="home-features">
                <h2>Features</h2>
                <ul>
                    <li>Collaborative Code Editor</li>
                    <li>Study Groups</li>
                    <li>Interactive Learning Materials</li>
                    <li>Real-time Code Execution</li>
                </ul>
            </section>
            <footer className="home-footer">
                <p>Join us today and enhance your learning experience!</p>
            </footer>
        </div>
    );
};

export default Home;