// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setLoggedIn, setToken}) { // Passes two booleans
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => { // Function to handle user login
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            setToken(response.data.token);
            setLoggedIn(true);
            navigate('/Chat');
        } catch (error) { // Something went wrong
            const errorMessage = error.response ? error.response.data.error : error.message;
            console.error('Login failed:', errorMessage);
            alert('Login failed: ' + errorMessage);
        }
    };

    return (
        <div className="loginContainer">
            <h1>WELCOME TO ZAPCHIRP</h1> 
            <h2>Login with your Zap Credentials</h2>
            <input
                type="text"
                placeholder="Username..."
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <input
                type="password"
                placeholder="Password..."
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? <button onClick={() => navigate('/Register')}>Register here to start zapping</button></p>
        </div>
    );
}

export default Login;