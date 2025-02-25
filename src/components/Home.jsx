import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {deleteSurvey, listSurveys} from '../api/api.js';
import {BACKEND_WS_URL} from '../config.js';
import styles from '../styles/Home.module.css';
//import SurveyAnswers from "./SurveyAnswers.jsx";

export default function Home() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const columns = ["#", "name", "user", "created", "questions", "answers", "link", "fill", "delete"];
    const socketRef = useRef(null);

    useEffect(() => {
        console.log("Init. fetch surveys data");
        const fetchSurveys = async () => {
            try {
                const data = await listSurveys();
                //const data = odata.map(item => ({...item, countAnswers: ""}));
                setSurveys(data.sort((a, b) => b.timestamp - a.timestamp));
                initWebSockets();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
        return () => {
            socketRef.current && socketRef.current.close();
        };
    }, []);

    const initWebSockets = async () => {
        console.log("Websockets init");
        socketRef.current = new WebSocket(BACKEND_WS_URL);

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
            socketRef.current.send('Hello from SH-FrontEnd (React)');
        };

        socketRef.current.onmessage = (event) => {
            const udata = JSON.parse(event.data);
            switch (udata.type) {
                case "hello": {
                    console.log("Hello message from WS server: " + event.data);
                    break;
                }
                case "ansCount": {
                    console.log('WS received \'ansCount\' meessage: ', event.data);
                    setSurveys((prevData) => prevData.map(item => {
                        if (item.surveyId === udata.surveyId) {
                            return {...item, answerCount: udata.answerCount};
                        } else {
                            return item;
                        }
                    }));
                    socketRef.current.send('Ack from client: ' + event.data);
                    break;
                }
                case "surveyDelete": {
                    console.log('WS received \'surveyDelete\' message: ', event.data);
                    setSurveys((prev) => prev.filter(surv => surv.surveyId !== udata.surveyId));
                    break;
                }
                case "surveyCreate": {
                    console.log('WS received \'surveyCreate\' message: ', event.data);
                    //setSurveys((prevSurveys) =>prevSurveys.filter((survey) => survey.surveyId !== udata.surveyId));
                    //setSurveys(data.sort((a, b) => b.timestamp - a.timestamp));
                    setSurveys(prev => {
                        const upd = [...prev, udata.survey];
                        return upd.sort((a, b) => b.timestamp - a.timestamp)
                    });
                    break;
                }
                default : {
                    console.error("Unknown websocket message type: " + udata.type);
                }
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed.');
        };
    }

    const handleDelete = async (surveyId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this survey?");
        if (confirmDelete) {
            try {
                await deleteSurvey(surveyId);
                setSurveys((prevSurveys) =>
                    prevSurveys.filter((survey) => survey.surveyId !== surveyId));
            } catch (error) {
                console.error("Error deleting survey:", error);
                alert("An error occurred while deleting the survey. " + error);
            }
        }
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => alert("Link copied(1)"))
                .catch((err) => console.error("Failed to copy: ", err));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                alert("Link copied(2)");
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1>Surveys</h1>
            <div className={styles.dataContainer}>
                <table>
                    <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={styles.dataItem}>{col.toUpperCase()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {surveys.map((row, rowInd) => (
                        <tr key={row.surveyId} className={styles.dataItem}>
                            <td>{rowInd}</td>
                            <td>{row.name}</td>
                            <td>{row.userId}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            <td>{(<Link to={`/survey/${row.surveyId}`} state={{tmpSrvFromHome: row}}>View
                                Form</Link>)}< /td>
                            <td>{row.answerCount < 1 ? (<span>View Answers ({row.answerCount})</span>) :
                                (<Link to={`/answer/survey/${row.surveyId}`}>View Answers ({row.answerCount})</Link>)}
                            </td>
                            <td>
                                <button
                                    onClick={() => copyToClipboard(`${window.location.origin}/survey/answer/${row.surveyId}`)}>
                                    Copy Link
                                </button>
                            </td>
                            <td>
                                {
                                    (

                                        <button type="button"
                                                onClick={() => navigate(`/survey/answer/${row.surveyId}`, {state: {tmpSrvFromHome: row}})}>
                                            Answer
                                        </button>

                                    )
                                }
                            < /td>
                            <td>{(<button type="button"
                                          onClick={() => handleDelete(`${row.surveyId}`)}>
                                Delete
                            </button>)}
                            < /td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button onClick={() => navigate('/survey', {state: {}})}>
                Create Survey
            </button>
        </div>
    );
};
