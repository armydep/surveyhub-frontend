import {useEffect, useState} from 'react';
import {fetchWithAuth} from './wallet_api.jsx';
import {Link, useNavigate} from 'react-router-dom';
//import {deleteSurvey, listSurveys} from '../api/api.js';
//import {BACKEND_WS_URL} from '../config.js';
//import styles from '../styles/Home.module.css';
//import {useNavigate} from 'react-router-dom';
import styles from './WalletStyles.jsx';

export default function WalletHome() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const result = await fetchWithAuth('/wallet/api/user/user');
                const result = await fetchWithAuth('/wallet/api/operation/balance/15ZbsZw8zhSBToqBkAvdQzBjWeAg43htBf');
                setData(result);
            } catch (error) {
                setError('Failed to fetch data: ' + error);
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}