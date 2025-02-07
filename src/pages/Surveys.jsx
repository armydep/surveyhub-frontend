import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";

export default function Surveys() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                console.log("Backend url: " + SURVEYS_BACKEND_URL);
                const response = await fetch(SURVEYS_BACKEND_URL + "/api/survey");
                if (!response.ok) {
                    console.error('Failed to fetch');
                    return;
                }
                const data = await response.json();
                setSurveys(data);
                console.log("Surveys: " + JSON.stringify(data));
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
                            <Link to={`/survey/${survey.surveyId}`} state={{testp1: "value1"}}>{survey.name}</Link>
                        </li>
                    ))
                }
            </ul>
            <button onClick={() => navigate('/new', {state: {testp1: "value1"}})}>
                {/*<button onClick={() => window.location.href = '/new'}>*/}
                Create Survey
            </button>
        </div>
    );
};
