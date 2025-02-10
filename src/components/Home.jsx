import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {deleteSurvey, listSurveys} from '../api/api.js';

export default function Home() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const columns = ["#", "name", "user", "created", "view", "answer", "delete"];

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

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const data = await listSurveys();
                setSurveys(data.sort((a, b) => b.timestamp - a.timestamp));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Surveys</h1>
            <div>
                <table border="1" cellPadding="5" style={{borderStyle: "unset"}}>
                    <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col.toUpperCase()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {surveys.map((row, rowInd) => (
                        <tr key={row.rowInd}>
                            <td>{rowInd}</td>
                            <td>{row.name}</td>
                            <td>{row.userId}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            <td>{(<Link to={`/survey/${row.surveyId}`} state={{tmpSrvFromHome: row}}>View</Link>)}< /td>
                            <td>{(<button type="button" style={{marginLeft: '10px'}}
                                          onClick={() => navigate(`/survey/answer/${row.surveyId}`, {state: {tmpSrvFromHome: row}})}>
                                    Answer
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
