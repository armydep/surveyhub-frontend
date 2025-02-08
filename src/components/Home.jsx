import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {deleteSurvey, listSurveys} from '../api/api.js';

export default function Home() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                setSurveys(data);
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
            <h1>Surveys List</h1>
            <ul>
                {
                    surveys.map(survey => (
                        <li key={survey.surveyId}>
                            <Link to={`/survey/${survey.surveyId}`}
                                  state={{tmpSrvFromHome: survey}}>{survey.name}</Link>
                            <button type="button"
                                    onClick={() => navigate(`/survey/answer/${survey.surveyId}`, {state: {tmpSrvFromHome: survey}})}
                                    style={{marginLeft: '10px'}}>
                                Answer
                            </button>
                            <button type="button" onClick={() => handleDelete(`${survey.surveyId}`)}
                                    style={{marginLeft: '10px'}}>
                                Delete
                            </button>
                        </li>
                    ))
                }
            </ul>
            <button onClick={() => navigate('/survey', {state: {}})}>
                Create Survey
            </button>
        </div>
    );
};
