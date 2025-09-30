
import React, { useState } from 'react';
import '../pages/forms.css';
import '../modal.css';

const CreateTeamModal = ({ closeModal, projectId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, projectId })
            });

            if (response.ok) {
                closeModal();
            } else {
                console.error('Failed to create team');
            }
        } catch (error) {
            console.error('Error creating team:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Team</h2>
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Team Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Team</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTeamModal;
