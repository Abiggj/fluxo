
import React, { useState, useEffect } from 'react';
import CreateTeamModal from './CreateTeamModal';
import '../modal.css';

const Team = () => {
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectId = '669f7e39981881b19b815227'; // Hardcoded for now

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/teams/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTeams(data);
            } else {
                console.error('Failed to fetch teams');
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }

    useEffect(() => {
        fetchTeams();
    }, [projectId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        fetchTeams();
    }

    return (
        <div id="team" className="content-section">
            <div className="page-header">
                <h1 className="page-title">Team</h1>
                <p className="page-description">Manage team members and view their current status</p>
            </div>

            <div className="board-header">
                <div className="board-actions">
                    <button className="btn btn-primary" onClick={openModal}>Create Team</button>
                </div>
            </div>
            
            <div className="team-grid">
                {teams.map(team => (
                    <div className="team-card" key={team.id}>
                        <div className="team-avatar">{team.name.charAt(0)}</div>
                        <h3 className="team-name">{team.name}</h3>
                        <p className="team-role">{team.description}</p>
                        <div className="team-status status-online">
                            <span className="status-indicator"></span>
                            Online
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <CreateTeamModal closeModal={closeModal} projectId={projectId} />}
        </div>
    );
}

export default Team;
