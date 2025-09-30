
import React, { useState, useEffect } from 'react';
import CreateTaskModal from './CreateTaskModal';
import '../modal.css';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workId = '669f7e39981881b19b81522a'; // Hardcoded for now

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/work/${workId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [workId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        fetchTasks();
    }

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    }

    return (
        <div id="kanban" className="content-section active">
            <div className="page-header">
                <h1 className="page-title">UI Development Board</h1>
                <p className="page-description">Track and manage development tasks for the website redesign project</p>
            </div>
            
            <div className="board-header">
                <div className="board-actions">
                    <button className="btn btn-primary" onClick={openModal}>Create Issue</button>
                    <button className="btn btn-secondary">View All Issues</button>
                </div>
            </div>
            
            <div className="kanban-board">
                {/* To Do Column */}
                <div className="kanban-column">
                    <div className="column-header">
                        <h3 className="column-title">To Do</h3>
                        <span className="column-count">{getTasksByStatus('To Do').length}</span>
                    </div>
                    {getTasksByStatus('To Do').map(task => (
                        <div className="task-card priority-high" key={task.id}>
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-footer">
                                <span className="task-priority priority-high">High</span>
                                <div className="task-assignee">
                                    <div className="assignee-avatar">SM</div>
                                    <span className="assignee-name">Sarah M.</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* In Progress Column */}
                <div className="kanban-column">
                    <div className="column-header">
                        <h3 className="column-title">In Progress</h3>
                        <span className="column-count">{getTasksByStatus('In Progress').length}</span>
                    </div>
                    {getTasksByStatus('In Progress').map(task => (
                        <div className="task-card priority-high" key={task.id}>
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-footer">
                                <span className="task-priority priority-high">High</span>
                                <div className="task-assignee">
                                    <div className="assignee-avatar">JD</div>
                                    <span className="assignee-name">John D.</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Review Column */}
                <div className="kanban-column">
                    <div className="column-header">
                        <h3 className="column-title">Code Review</h3>
                        <span className="column-count">{getTasksByStatus('Code Review').length}</span>
                    </div>
                    {getTasksByStatus('Code Review').map(task => (
                        <div className="task-card priority-medium" key={task.id}>
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-footer">
                                <span className="task-priority priority-medium">Medium</span>
                                <div className="task-assignee">
                                    <div className="assignee-avatar">RJ</div>
                                    <span className="assignee-name">Ryan J.</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Done Column */}
                <div className="kanban-column">
                    <div className="column-header">
                        <h3 className="column-title">Done</h3>
                        <span className="column-count">{getTasksByStatus('Done').length}</span>
                    </div>
                    {getTasksByStatus('Done').map(task => (
                        <div className="task-card priority-low" key={task.id}>
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-footer">
                                <span className="task-priority priority-low">Low</span>
                                <div className="task-assignee">
                                    <div className="assignee-avatar">SM</div>
                                    <span className="assignee-name">Sarah M.</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && <CreateTaskModal closeModal={closeModal} workId={workId} />}
        </div>
    );
}

export default KanbanBoard;
