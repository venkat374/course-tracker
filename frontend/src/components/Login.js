// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ setLoggedInUserId, setAuthToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Adjust this URL if your backend is not under /auth/login
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                username,
                password,
            });

            const { token, user } = response.data;

            // Store token and user ID in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('loggedInUserId', user.id);

            // Update state in App.js
            setAuthToken(token);
            setLoggedInUserId(user.id);

            history.push('/'); // Redirect to the main course list page
        } catch (err) {
            console.error('Login error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div>
            <h3>Login</h3>
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
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;