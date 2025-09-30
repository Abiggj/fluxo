import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, roleId: '669f7d39981881b19b815220' })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                // Handle signup error
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">Create an Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary form-btn">Sign Up</button>
                </form>
                <p className="form-footer">Already have an account? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
}

export default SignupPage;
