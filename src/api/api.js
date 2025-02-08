
const surveyApiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const fetchSurveyById = async (surveyId) => {
    return surveyApiRequest(`/api/survey/${surveyId}`, {
        method: 'GET',
    });
};

export const fetchSurveys = async () => {
    return surveyApiRequest('/api/survey');
};

export const deleteSurvey = async (surveyId) => {
    return surveyApiRequest(`/api/survey/${surveyId}`, {
        method: 'POST',
        //method: 'DELETE',
    });
};

export const submitAnswers = async (answerForm) => {
    return surveyApiRequest('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerForm),
    });
};