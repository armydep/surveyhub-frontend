import {useEffect, useState} from 'react';
import {fetchWithAuth, sendMoney} from './wallet_api.jsx';
import styles from "./WalletHomeStyles.jsx";

export default function WalletHome() {
    const [balanceData, setBalanceData] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [amountToSend, setAmountToSend] = useState('');
    const [error, setError] = useState(null);
    const [targetAddress, setTargetAddress] = useState('');
    //const signState = useRef({signedIn: false});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchWithAuth();
                console.debug("Balance data amount: ", result.amount);
                setCurrentBalance(result.amount);
                setUserAddress(result.address);
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

    const handleSendMoney = async () => {
        if (!amountToSend || !targetAddress) {
            alert('Please fill in both amount and target address.');
            return;
        }
        const amountNumber = parseFloat(amountToSend);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (amountToSend > currentBalance) {
            alert('Insufficient balance.');
            return;
        }
        const {btc, sat} = splitNumber(parseFloat(amountToSend));
        try {
            console.debug("Amount to send btc: " + btc + ". sat: " + sat);
            const confirmTransfer = window.confirm("Amount to transfer. btc: " + btc + " sat:" + sat);
            if (confirmTransfer) {
                sendMoney(userAddress, targetAddress, btc, sat);
                //setCurrentBalance(result.amount);
                //setUserAddress(result.address);
                //setBalanceData(result);
            }
        } catch (error) {
            setError('Failed to send: ' + error);
            console.error('Error:', error);
        }
    };

    function splitNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            throw new Error('Input must be a valid number');
        }
        let integerPart = Math.floor(num);
        let floatingPartStr = (num - integerPart).toFixed(9).split('.')[1];
        floatingPartStr = floatingPartStr.replace(/0+$/, '');
        let floatingPart = parseInt(floatingPartStr === '' ? '0' : floatingPartStr);
        return {
            btc: integerPart,
            sat: floatingPart
        };
    }

    return (error ? (<p style={{color: 'red'}}>{error}</p>) :
            <div>
                <div style={styles.dashboard}>
                    <h2>Wallet</h2>

                    {/* Balance Section */}
                    <div style={styles.balanceSection}>
                        <label style={styles.label}>Address:</label>
                        <span style={styles.balanceAmount}>{userAddress}</span>
                    </div>
                    <div style={styles.balanceSection}>
                        <label style={styles.label}>Balance:</label>
                        <span style={styles.balanceAmount}>{currentBalance} BTC</span>
                    </div>

                    {/* Send Money Section */}
                    <div style={styles.sendMoneySection}>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amountToSend}
                            onChange={(e) => {
                                    if (e.target.value <= currentBalance && e.target.value > 0) {
                                        setAmountToSend(e.target.value)
                                    }
                                }
                            }
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Target Address"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleSendMoney} type="submit" style={styles.button} disabled={false}>
                            Send Money
                        </button>
                    </div>
                </div>
            </div>
    )
        ;
}