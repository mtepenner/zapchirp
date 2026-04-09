// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ setRegistered }) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // State for password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [gender, setGender] = useState("");
    const navigate = useNavigate();
    
    // Validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

     // Validate gender input
     const validateGender = (gender) => {
        const allowedGenders = ["male", "female", "nonbinary"];
        return allowedGenders.includes(gender.toLowerCase());
    }


    const handleRegister = async () => {
        
        if (!validateEmail(email)) {
            alert('Invalid email format');
            return;
        }

        if (!validateGender(gender)) {
            alert('Gender not recognized by computer');
            return;
        }

        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/signup', { fullName, username, email, password, gender });
            setRegistered(true); // Notify parent that registration is complete
            alert('Registration successful! Please log in.');
            navigate('/');
        } catch (error) {
            console.error('Registration failed!', error);
            alert('Registration failed: ' + (error.response ? error.response.data : 'Unknown error'));
        }
    };

    return (
        <div className="registerContainer">
            <h1>Register to ZapChirp</h1>
            <input
                type="text"
                placeholder="Full Name..."
                onChange={(event) => {
                    setFullName(event.target.value);
                }}
            />
            <input
                type="text"
                placeholder="Username..."
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <input
                type="text"
                placeholder="Email..."
                onChange={(event) => {
                    setEmail(event.target.value);
                }}
            />
            <input
                type="password"
                placeholder="Password..."
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <input
                type="password"
                placeholder="Confirm Password..."
                onChange={(event) => {
                    setConfirmPassword(event.target.value);
                }}
            />

            <input
                type="text"
                placeholder="Gender..."
                onChange={(event) => {
                    setGender(event.target.value);
                }}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;