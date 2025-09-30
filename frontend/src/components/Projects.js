
import React, { useState, useEffect } from 'react';
import CreateProjectModal from './CreateProjectModal';
import '../modal.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        fetchProjects(); // Refetch projects after closing the modal
    }

    return (
        <div id="projects" className="content-section">
            <div className="page-header">
                <h1 className="page-title">Projects</h1>
                <p className="page-description">Overview of all active and planned projects</p>
            </div>

            <div className="board-header">
                <div className="board-actions">
                    <button className="btn btn-primary" onClick={openModal}>Create Project</button>
                </div>
            </div>
            
            <div className="projects-grid">
                {projects.map(project => (
                    <div className="project-card" key={project.id}>
                        <div className="project-header">
                            <h3 className="project-name">{project.name}</h3>
                            <span className="project-status status-active">Active</span>
                        </div>
                        <p className="project-description">
                            {project.description}
                        </p>
                        <div className="project-progress">
                            <div className="progress-header">
                                <span className="progress-label">Progress</span>
                                <span className="progress-value">75%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '75%'}}></div>
                            </div>
                        </div>
                        <div className="project-meta">
                            <span>Due: Dec 15, 2025</span>
                            <div className="project-team">
                                <div className="assignee-avatar">JD</div>
                                <div className="assignee-avatar">SM</div>
                                <div className="assignee-avatar">AL</div>
                                <div className="assignee-avatar">+3</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <CreateProjectModal closeModal={closeModal} />}
        </div>
    );
}

export default Projects;
