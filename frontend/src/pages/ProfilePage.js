
import React, { useState, useEffect } from 'react';
import './forms.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setName(data.name);
                    setEmail(data.email);
                } else {
                    console.error('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUser();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">My Profile</h1>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary form-btn">Update Profile</button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
