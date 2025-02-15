import {fetchAnswerById} from '../api/api.js';
import styles from '../styles/Answer.module.css'

import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";

export default function Answer() {
    const {answerId} = useParams();
    const [answerData, setAnswerData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Init. fetch answer data: ", answerId);
        const fetchAnswerData = async () => {
            try {
                const data = await fetchAnswerById(answerId);
                setAnswerData(data);
                console.log("Answer fetched: ", data)
            } catch (err) {
                setError(err.message);
            } finally {
                //setLoading(false);
            }
        };
        fetchAnswerData();
        return () => {
            //socketRef.current && socketRef.current.close();
        };
    }, []);

    return (
        <div className={styles.container}>
            <h1>Answer</h1>
            <div className={styles.dataContainer}>
                <textarea disabled rows={20} value={JSON.stringify(answerData, null, 2)}/>
            </div>
            {error && (<div style={{color: 'red'}}>
                <h2>Error:</h2>
                <p>{error}</p>
            </div>)}
        </div>
    );

};
