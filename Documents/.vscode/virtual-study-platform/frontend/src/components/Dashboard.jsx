import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome to the Virtual Study Platform</h1>
                <nav className="dashboard-nav">
                    <Link to="/projects">Projects</Link>
                    <Link to="/study-groups">Study Groups</Link>
                    <Link to="/resources">Resources</Link>
                    <Link to="/assignments">Assignments</Link>
                </nav>
            </header>
            <main className="dashboard-content">
                <section className="projects-overview">
                    <h2>Your Projects</h2>
                    {/* Placeholder for project cards */}
                </section>
                <section className="study-groups-overview">
                    <h2>Your Study Groups</h2>
                    {/* Placeholder for study group cards */}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;