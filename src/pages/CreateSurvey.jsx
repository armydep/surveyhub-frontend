import {useState} from 'react';

const SURVEYS_BACKEND_URL = "http://armydep.duckdns.org:8080";


export default function CreateNewSurvey() {
    const [name, setName] = useState('');
    const [responseData, setResponseData] = useState(null); // State to store the API response
    const [error, setError] = useState(null); // State to handle errors

    const [textAreas, setTextAreas] = useState([]);
    const addTextArea = () => {
        setTextAreas([...textAreas, '']);
    };

    const handleTextAreaChange = (index, event) => {
        const newTextAreas = [...textAreas];
        newTextAreas[index] = event.target.value;
        setTextAreas(newTextAreas);
    };

    const buildSurveyData = (name, qTexts) => {
        return {
            name: name,
            userId: 10024,
            questions: qTexts.map(question => JSON.parse(question))
        }
    };
    //questions: qTexts.map(question => ({ qtext: question }))

    const isFormValid = () => {
        return textAreas.length > 0 && textAreas.some((value) => value.trim() !== '');
    };

    const removeTextArea = (index) => {
        const newTextAreas = textAreas.filter((_, i) => i !== index);
        setTextAreas(newTextAreas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isFormValid()) {
                console.error('Invalid form');
                setError('Invalid form');
                return;
            }
            const bodyStr = JSON.stringify(buildSurveyData(name, textAreas));
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
                setError('Failed to create survey');
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
                    <button onClick={addTextArea}>Add Question</button>
                    {
                        textAreas.map((value, index) => (
                            <div key={index} style={{marginTop: '10px'}}>
                            <textarea
                                value={value}
                                onChange={(event) => handleTextAreaChange(index, event)}
                                placeholder="Type something..."
                                required
                            />
                                <button
                                    type="button"
                                    onClick={() => removeTextArea(index)}
                                    style={{marginLeft: '10px'}}>
                                    Remove
                                </button>
                            </div>
                        ))
                    }
                </div>

                <button type="submit" disabled={!isFormValid()}>Create Survey</button>
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
