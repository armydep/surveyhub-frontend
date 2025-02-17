const WALLET_BACKEND_URL = 'http://armydep.duckdns.org';
//export const WALLET_BACKEND_URL = 'http://localhost:8082';

export const signInWallet = async (username, password) => {
    try {
        const url = `${WALLET_BACKEND_URL}/wallet/api/login/signin?username=${username}&password=${password}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }//,
            //body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            return await response.json();
            //console.log('Login successful:', data);
            //localStorage.setItem('jwtToken', data);
            //navigate('/wallet/home'); // Redirect to dashboard
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export async function fetchWithAuth(url, options = {}) {
    const jwtStr = localStorage.getItem('jwtToken');
    const jwt = JSON.parse(jwtStr);

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${jwt.token}`,
    };

    const response = await fetch(`${WALLET_BACKEND_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
}
