import {BACKEND_API_URL} from '../config.js'

const surveyApiRequest = async (url, options = {}, resp = "text") => {
    try {
        const response = await fetch(BACKEND_API_URL + url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (resp === 'text') {
            return await response.text();
        } else {
            return await response.json();
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const listSurveys = async () => {
    return surveyApiRequest("/api/survey", {
        method: "GET"
    }, "json");
};

export const deleteSurvey = async (surveyId) => {
    return surveyApiRequest(`/api/survey/${surveyId}`, {
        method: "POST"
    }, "text");
};

export const submitSurvey = async (survey) => {
    return surveyApiRequest("/api/survey", {
        method: 'POST',
        body: survey,
        headers: {
            'Content-Type': 'application/json',
        }
    }, "text");
};

export const fetchSurveyById = async (surveyId) => {
    console.log("Fetching survey by id: ", surveyId)
    return surveyApiRequest(`/api/survey/${surveyId}`, {
        method: 'GET',
    }, "json");
};

export const submitAnswers = async (answerForm) => {
    return surveyApiRequest("/api/survey/answers", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerForm),
    }, "text");
};