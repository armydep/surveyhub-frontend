import React, {useState} from 'react';

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";


export default function CreateNewSurvey() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [responseData, setResponseData] = useState(null); // State to store the API response
    const [error, setError] = useState(null); // State to handle errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const bodyStr = JSON.stringify(
                {
                    "name": "my fe survey",
                    "userId": 10023,
                    "questions": [
                        {
                            "question": "Have you been in London",
                            "type": "BOOLEAN",
                            "required": true
                        },
                        {
                            "question": "how many hobbies do you have",
                            "type": "INTEGER",
                            "min": 0,
                            "max": 30,
                            "required": true
                        },
                        {
                            "question": "Tell my a story pls",
                            "type": "TEXT",
                            "min": 0,
                            "max": 100,
                            "required": true
                        }
                    ]
                }
            );
            console.log('Request Body:', bodyStr);

            const response = await fetch(SURVEYS_BACKEND_URL + '/api/survey', {
                method: 'POST',
                body: bodyStr,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error('Failed to create survey');
                return;
            }
            const data = await response.text();
            console.log("Created ok. id: " + data);
            setResponseData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setResponseData(null);
            console.error("Fetch block error: " + err.message);
        }
    };

    return (
        <div>
            <h1>Create New Survey3</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Survey</button>
            </form>

            {/* Display the API response */}
            {responseData && (
                <div>
                    <h2>Survey Created Successfully!</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}

            {/* Display errors if any */}
            {error && (
                <div style={{color: 'red'}}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
