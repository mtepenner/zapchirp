// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login({ setLoggedIn, setToken, setUsername: setGlobalUsername }) { 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => { 
        try {
            // Using relative path because baseURL is set in App.js
            const response = await axios.post('/api/auth/login', { username, password });
            setToken(response.data.token);
            setLoggedIn(true);
            
            // Set the global username state in App.js so chat rooms generate correctly
            if (setGlobalUsername) {
                // Use the backend's returned username, fallback to local state if missing
                setGlobalUsername(response.data.username || username); 
            }

            navigate('/chat'); // Changed to lowercase to match your App.js Route path
        } catch (error) { 
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
            <p>Don't have an account? <button onClick={() => navigate('/register')}>Register here to start zapping</button></p>
        </div>
    );
}

export default Login;
