const WALLET_BACKEND_URL = 'http://armydep.duckdns.org';
//export const WALLET_BACKEND_URL = 'http://localhost:8082';

export const signInWallet = async (username, password) => {
    try {
        const url = `${WALLET_BACKEND_URL}/wallet/api/login/signin?username=${username}&password=${password}`;
        const response = await fetch(url, {method: 'POST'});
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const signUpWallet = async (username, password) => {
    try {
        const url = `${WALLET_BACKEND_URL}/wallet/api/login/signup`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export async function fetchWithAuth() {
    const jwtStr = localStorage.getItem('jwtToken');
    const jwt = JSON.parse(jwtStr);
    const headers = {
        'Authorization': `Bearer ${jwt.token}`,
    };
    const url = '/wallet/api/operation/balance';
    const response = await fetch(`${WALLET_BACKEND_URL}${url}`, {
        method: "GET", headers: headers
    });
    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
}
