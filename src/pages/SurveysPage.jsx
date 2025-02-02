import { useEffect, useState } from 'react';

const SurveysPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:5000/surveys');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
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
        {surveys.map(survey => (
          <li key={survey.id}>
            <h3>{survey.name}</h3>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SurveysPage;