import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org";//"http://armydep.duckdns.org:8080";

export default function Home() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleDelete = (surveyId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this survey?");
        if (confirmDelete) {
            fetch(`${SURVEYS_BACKEND_URL}/api/survey/${surveyId}`, {
                method: "POST"
            })
                .then((response) => {
                    if (response.ok) {
                        setSurveys((prevSurveys) =>
                            prevSurveys.filter((survey) => survey.surveyId !== surveyId)
                        );
                    } else {
                        alert("Failed to delete survey.");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting survey:", error);
                    alert("An error occurred while deleting the survey.");
                });
        }
    };

    useEffect(() => {


        const fetchSurveys = async () => {
            try {
                console.log("Backend url: " + SURVEYS_BACKEND_URL);
                const response = await fetch(`${SURVEYS_BACKEND_URL}/api/survey`);
                if (!response.ok) {
                    console.error('Failed to fetch');
                    return;
                }
                const data = await response.json();
                setSurveys(data);
                console.log("Home: " + JSON.stringify(data));
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
                            <Link to={`/survey/${survey.surveyId}`} state={{testp1: "value123", surv: survey}}>{survey.name}</Link>
                            <button type="button"
                                    onClick={() => navigate(`/survey/answer/${survey.surveyId}`, {state: {surv: survey}})}
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
            <button onClick={() => navigate('/survey', {state: {testp1: "value1"}})}>
                {/*<button onClick={() => window.location.href = '/new'}>*/}
                Create Survey
            </button>
        </div>
    );
};
