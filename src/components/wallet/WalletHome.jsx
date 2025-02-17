import {useEffect, useRef, useState} from 'react';
import {fetchWithAuth} from './wallet_api.jsx';
import styles from "./WalletHomeStyles.jsx";

export default function WalletHome() {
    const [balanceData, setBalanceData] = useState(null);
    const [amount, setAmount] = useState(null);
    const [error, setError] = useState(null);
    const [targetAddress, setTargetAddress] = useState(null);
    //const signState = useRef({signedIn: false});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchWithAuth();
                console.debug("Balance data amount: ", result.amount);
                setAmount(result.amount);
                setBalanceData(result);
            } catch (error) {
                setError('Failed to fetch data: ' + error);
                console.error('Error:', error);
            }
        };

        const isLoggedOut = !localStorage.getItem("jwtToken") ||
            localStorage.getItem("jwtToken") === 'null' || localStorage.getItem("jwtToken") === '';

        if (!isLoggedOut) {
            fetchData();
        } else {
            setError("Log in");
        }
    }, []);

    const handleSendMoney = () => {
        // if (!amount || !targetAddress) {
        //     alert('Please fill in both amount and target address.');
        //     return;
        // }
        //
        // const amountNumber = parseFloat(amount);
        // if (isNaN(amountNumber) || amountNumber <= 0) {
        //     alert('Please enter a valid amount.');
        //     return;
        // }
        //
        // if (amountNumber > balance) {
        //     alert('Insufficient balance.');
        //     return;
        // }
        //
        // // Simulate sending money (update balance)
        // setBalance((prevBalance) => prevBalance - amountNumber);
        // alert(`Sent ${amountNumber} to ${targetAddress}`);
        //
        // // Reset input fields
        // setAmount('');
        // setTargetAddress('');
    };

    return (error ? (<p style={{color: 'red'}}>{error}</p>) :
            <div>
                <div style={styles.dashboard}>
                    <h2>Wallet</h2>

                    {/* Balance Section */}
                    <div style={styles.balanceSection}>
                        <label style={styles.label}>Balance:</label>
                        <span style={styles.balanceAmount}>{amount} BTC</span>
                    </div>

                    {/* Send Money Section */}
                    <div style={styles.sendMoneySection}>
                        <input
                            type="text"
                            placeholder="Amount"
                            value=""
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Target Address"
                            value=""
                            onChange={(e) => setTargetAddress(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleSendMoney} style={styles.button}>
                            Send Money
                        </button>
                    </div>
                </div>
            </div>
    )
        ;
}