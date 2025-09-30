import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TopBar from './components/TopBar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const [activeSection, setActiveSection] = useState('kanban');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Add authentication state

    const showSection = (sectionName) => {
        setActiveSection(sectionName);
    }

    // Dummy login function for now
    const login = () => {
        setIsAuthenticated(true);
    }

    // Dummy logout function for now
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage login={login} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route 
                    path="/*" 
                    element={
                        isAuthenticated ? (
                            <div className="app-container">
                                <Sidebar showSection={showSection} />
                                <div className="main-content">
                                    <TopBar logout={logout} />
                                    <div className="content-area">
                                        <MainContent activeSection={activeSection} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;