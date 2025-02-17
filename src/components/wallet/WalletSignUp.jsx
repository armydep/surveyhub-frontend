import styles from './WalletSignUpStyles.jsx';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {signUpWallet} from "./wallet_api.jsx";


export default function WalletSignUp() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const data = await signUpWallet(username, password);
            console.log('Login successful:', data);
            localStorage.setItem('jwtToken', null);
            navigate('/wallet/login');
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
};

