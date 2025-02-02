import { useEffect, useState } from 'react';

const SURVEYS_BACKEND_URL = 'http://arkady-desktop-7oje26k:8080/api/survey';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(SURVEYS_BACKEND_URL);
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
