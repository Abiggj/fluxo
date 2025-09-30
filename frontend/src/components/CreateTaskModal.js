
import React, { useState } from 'react';
import '../pages/forms.css';
import '../modal.css';

const CreateTaskModal = ({ closeModal, workId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('To Do');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, dueDate, status, workId })
            });

            if (response.ok) {
                closeModal();
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Task</h2>
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Code Review">Code Review</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Task</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTaskModal;
