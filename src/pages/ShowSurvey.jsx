import {useLocation, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";

export default function ShowSurvey() {
    const location = useLocation();
    const { testp1 } = location.state || {};
    console.log("Show survey testp1: " + testp1);
    const {surveyId} = useParams();

    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                console.log("Backend url: " + SURVEYS_BACKEND_URL);
                const response = await fetch(`${SURVEYS_BACKEND_URL}/api/survey/${surveyId}`);

                if (!response.ok) {
                    console.error('Failed to fetch');
                    return;
                }
                const data = await response.json();
                setSurvey(data);
                console.log("Survey: " + JSON.stringify(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="survey-details">
                <h1>Survey: {survey.name}</h1>
                <p><strong>Survey ID:</strong>{survey.surveyId}</p>
                <p><strong>User ID:</strong>{survey.userId}</p>
                <p><strong>Name:</strong>{survey.name}</p>
                <p><strong>Description:</strong>{survey.description}</p>
                <p><strong>Created:</strong>{new Date(survey.timestamp).toLocaleString()}</p>
            </div>

            <div>Questions</div>
            {
                survey.questions.map((q, index) => {
                    console.log("Iter Question type: " + q.type + ". index: " + index);
                    //const Component = questionComponents[q.type];
                    //return Component(index, q);
                })
            }
        </div>
    );
};
