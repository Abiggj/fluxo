
import React, { useState } from 'react';
import '../pages/forms.css';

const CreateProjectModal = ({ closeModal }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description })
            });

            if (response.ok) {
                closeModal();
                // Optionally, refresh the projects list
            } else {
                console.error('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Project</h2>
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Project Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Project</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateProjectModal;
