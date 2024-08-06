// src/pages/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { storeAccount } from '../../backend/Account/Account'; // Import the storeAccount function
import Account from '../../models/Account'; // Import the Account class
import '../../styles/AuthForms.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            // Create an Account object
            const account = new Account(
                user.displayName || username, // Use displayName if available, otherwise use username
                user.email,
                username
            );

            // Store the Account object in Firestore
            await storeAccount(account);

            console.log('Account successfully created:', user);
            navigate('/account');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="card">
            <div className="form-section">
                <div className="header">Sign Up</div>
                <div className="form-container">
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
