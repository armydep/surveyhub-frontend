import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {deleteSurvey, listSurveys} from '../api/api.js';
import {BACKEND_WS_URL} from '../../config.js'

export default function Home() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const columns = ["#", "name", "user", "created", "view", "answer", "delete"];
    const socketRef = useRef(null);

    useEffect(() => {
        console.log("Init. fetch surveys data");
        const fetchSurveys = async () => {
            try {
                const odata = await listSurveys();
                const data = odata.map(item => ({...item, countAnswers: 10}));
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
            socketRef.current.send('Hello from React!');
        };

        socketRef.current.onmessage = (event) => {
            const udata = JSON.parse(event.data);
            switch (udata.type) {
                case "ansCount": {
                    console.log('WS received \'ansCount\' meessage: ', event.data);
                    setSurveys((prevData) => prevData.map(item => {
                        if (item.surveyId === udata.surveyId) {
                            return {...item, countAnswers: udata.answersCount};
                        } else {
                            return item;
                        }
                    }));
                    socketRef.current.send('Ack from client: ' + event.data);
                    break;
                }
                case "surveyDelete": {
                    console.log('WS received \'surveyDelete\' message: ', event.data);
                    setSurveys((prevSurveys) =>
                        prevSurveys.filter((survey) => survey.surveyId !== udata.surveyId));
                    break;
                }
                case "surveyCreate": {
                    console.log('WS received \'surveyCreate\' message: ', event.data);
                    //setSurveys((prevSurveys) =>prevSurveys.filter((survey) => survey.surveyId !== udata.surveyId));
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Surveys</h1>
            <div>
                <table border="1" cellPadding="5" style={{borderStyle: "unset"}}>
                    <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.toUpperCase()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {surveys.map((row, rowInd) => (
                        <tr key={row.surveyId}>
                            <td>{rowInd}</td>
                            <td>{row.name}</td>
                            <td>{row.userId}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            <td>{(<Link to={`/survey/${row.surveyId}`} state={{tmpSrvFromHome: row}}>View</Link>)}< /td>
                            <td>{(<button type="button" style={{marginLeft: '10px'}}
                                          onClick={() => navigate(`/survey/answer/${row.surveyId}`, {state: {tmpSrvFromHome: row}})}>
                                Answer({row.countAnswers})
                            </button>)}
                            < /td>
                            <td>{(<button type="button" onClick={() => handleDelete(`${row.surveyId}`)}
                                          style={{marginLeft: '10px'}}>
                                Delete
                            </button>)}
                            < /td>

                            {/*columns.map((col, colInd) => (
                                <td key={col.colInd}>{row[col]}</td>
                            ))*/}
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
