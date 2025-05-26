// frontend/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // For success messages
    const [error, setError] = useState(''); // For error messages
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Adjust this URL if your backend is not under /auth/register
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
                username,
                password,
            });
            setMessage(response.data.message);
            // Optionally redirect to login after successful registration
            setTimeout(() => {
                history.push('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h3>Register User</h3>
            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
            </form>
        </div>
    );
}

export default Register;