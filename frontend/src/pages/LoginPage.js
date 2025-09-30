import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css';

const LoginPage = ({ login }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                login();
                navigate('/');
            } else {
                // Handle login error
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">Login to Fluxo</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary form-btn">Login</button>
                </form>
                <p className="form-footer">Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </div>
    );
}

export default LoginPage;
