import {useEffect, useState} from 'react';
import {fetchWithAuth} from './wallet_api.jsx';

export default function WalletHome() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const result = await fetchWithAuth('/wallet/api/user/user');
                const result = await fetchWithAuth('/wallet/api/operation/balance');
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