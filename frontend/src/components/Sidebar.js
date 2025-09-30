
import React from 'react';

const Sidebar = ({ showSection }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo">fluxo</div>
            </div>
            
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Planning</div>
                    <button className="nav-item active" onClick={() => showSection('kanban')}>
                        <span className="nav-icon">📋</span>
                        Kanban Board
                    </button>
                    <button className="nav-item" onClick={() => showSection('projects')}>
                        <span className="nav-icon">📁</span>
                        Projects
                    </button>
                </div>
                
                <div className="nav-section">
                    <div className="nav-section-title">People</div>
                    <button className="nav-item" onClick={() => showSection('team')}>
                        <span className="nav-icon">👥</span>
                        Team
                    </button>
                </div>
                
                <div className="nav-section">
                    <div className="nav-section-title">Reports</div>
                    <button className="nav-item" onClick={() => showSection('reports')}>
                        <span className="nav-icon">📊</span>
                        Analytics
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
