import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './WalletStyles.jsx';
import {signInWallet} from "./wallet_api.jsx";

export default function WalletLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = await signInWallet(username, password);
            console.log('Login successful:', data);
            localStorage.setItem('jwtToken', JSON.stringify(data));
            navigate('/wallet/home');
        } catch (error) {
            //setError('Failed to fetch data: ' + error);
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
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
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}