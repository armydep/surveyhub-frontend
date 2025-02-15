import {fetchSurveyAnswers} from '../api/api.js';
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from '../styles/SurveyAnswers.module.css'

export default function SurveyAnswers() {
    const {surveyId} = useParams();
    const [answersData, setAnswersData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //const navigate = useNavigate();
    const columns = ["#", "id", "user", "created", "view", "delete"];


    useEffect(() => {
        console.log("Init. fetch survey answers data: ", surveyId);
        const fetchSurveyAnswersData = async () => {
            try {
                const data = await fetchSurveyAnswers(surveyId);
                setAnswersData(data);
                console.log("Answer fetched: ", data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurveyAnswersData();
        return () => {
            //socketRef.current && socketRef.current.close();
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1>Survey Answers</h1>
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
                    {/*const columns = ["#", "id", "user", "created", "view", "delete"];*/}
                    {answersData.map((row, rowInd) => (
                        <tr key={row.formId} className={styles.dataItem}>
                            <td>{rowInd}</td>
                            <td>{row.formId}</td>
                            <td>{row.userId}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            {/*<td>{(<Link to={`/survey/${row.surveyId}`} state={{tmpSrvFromHome: row}}>View</Link>)}< /td>
                            <td>{(<button type="button"
                                          onClick={() => navigate(`/survey/answer/${row.surveyId}`, {state: {tmpSrvFromHome: row}})}>
                                Answer({row.answerCount})
                            </button>)}
                            < /td>
                            <td>{(<button type="button"
                                          onClick={() => handleDelete(`${row.surveyId}`)}>
                                Delete
                            </button>)}
                            < /td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/*<button onClick={() => navigate('/survey', {state: {}})}>
                Create Survey
            </button>*/}
        </div>
    );

};
