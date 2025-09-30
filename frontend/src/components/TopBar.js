
import React from 'react';
import { Link } from 'react-router-dom';

const TopBar = ({ logout }) => {
    return (
        <div className="top-bar">
            <div className="breadcrumb">
                <a href="#" className="breadcrumb-item">Digital Transformation</a>
                <span className="breadcrumb-separator">/</span>
                <a href="#" className="breadcrumb-item">Website Redesign</a>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-item">UI Development</span>
            </div>
            
            <div className="user-menu">
                <Link to="/profile" className="user-name-link">John Doe</Link>
                <div className="user-avatar">JD</div>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>
        </div>
    );
}

export default TopBar;
