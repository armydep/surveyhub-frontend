import { useEffect, useState } from 'react';

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        console.log("Backend url: " + SURVEYS_BACKEND_URL);
        const response = await fetch(SURVEYS_BACKEND_URL + "/api/survey");
        if (!response.ok) throw new Error('Failed to fetch');
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
        {surveys.map(survey => (
          <li key={survey.surveyId}>
            <h3>{JSON.stringify(survey)}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};
