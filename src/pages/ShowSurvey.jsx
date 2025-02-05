import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";

export default function ShowSurvey() {
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
            </div>

            <h2>Questions</h2>
            <ul className="questions-list">
                <li>
                    <div className="question-text">Is it lovely visit??</div>
                    <div className="input-area">
                        <textarea rows="2" readOnly>Yes/No</textarea>
                    </div>
                </li>
                <li>
                    <div className="question-text">How many lovely visits you have??</div>
                    <div className="input-area">
                        <textarea rows="2" readOnly>0 to 30</textarea>
                    </div>
                </li>
                <li>
                    <div className="question-text">Tell me a story</div>
                    <div className="input-area">
                        <textarea rows="4" readOnly>Enter your story here...</textarea>
                    </div>
                </li>
                <li>
                    <div className="question-text">What is your favored food</div>
                    <div className="input-area">
                        <textarea rows="2" readOnly>hamburger, pizza, hummus, fish</textarea>
                    </div>
                </li>
            </ul>
        </div>
    )
        ;

};

/*
    return (
        <div>
            <h1>Survey</h1>
            <p>Survey ID: {surveyId}</p>
        </div>
    );
*/
/*           <ul>
                           {
                               surveys.map(survey => (
                                   <li key={survey.surveyId}>
                                       <Link to={`/ShowSurvey/${survey.surveyId}`}>{survey.name}</Link>
                                   </li>
                               ))
                           }
                       </ul>
                       <button onClick={() => window.location.href = '/CreateSurvey'}>
                           Create Survey
                       </button>
           */