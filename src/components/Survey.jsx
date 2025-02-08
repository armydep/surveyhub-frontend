import {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {fetchSurveyById, submitSurvey} from "../api/api.js";


export default function Survey() {
    const {surveyId} = useParams();
    const location = useLocation();
    const isRedirectedFromAnswer = location.pathname.includes('/survey/answer/');
    const {tmpSrvFromHome} = location.state || {};
    const [mode, setMode] = useState(null);
    const [survey, setSurvey] = useState(tmpSrvFromHome);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);

    const [submitResponse, setSubmitResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeMyprop = async () => {
            try {
                if (surveyId && !tmpSrvFromHome) {
                    const result = await fetchSurveyById(surveyId);
                    setSurvey(result);
                    console.log('Survey fetched by id: ' + JSON.stringify(result));
                }
            } catch (error) {
                console.error('Error initializing survey:', error);
                setError('Error initializing survey: ' + error.message);
            }
        };
        initializeMyprop();
    }, [surveyId, tmpSrvFromHome]); // Depend on surveyId and tmpSrvFromHome

    useEffect(() => {
        if (survey) {
            if (isRedirectedFromAnswer) {
                setMode("answer");
            } else {
                setMode("view");
            }
        } else {
            if (isRedirectedFromAnswer) {
                setMode("error-answer");
            } else {
                if (surveyId) {
                    setMode("error-view");
                } else {
                    setMode("create");
                }
            }
        }
    }, [survey, isRedirectedFromAnswer, surveyId]); // Add dependencies

    useEffect(() => {
        if (survey) {
            setName(survey.name);
            setDescription(survey.description);
            setQuestions(survey.questions);
        }
    }, [survey]); // Depend on survey

    useEffect(() => {
        console.log(`Survey. Mode: ${mode}. ${surveyId}. survey: ${JSON.stringify(survey)}`);
    }, [mode, survey, surveyId]);

    const QUESTION_TYPES = Object.freeze({
        TEXT: "TEXT",
        BOOLEAN: "BOOLEAN",
        INTEGER: "INTEGER",
        OPTION_LIST: "OPTION_LIST"
    });

    const questionComponents = {
        [QUESTION_TYPES.BOOLEAN]: BooleanQuestionComponent,
        [QUESTION_TYPES.INTEGER]: IntegerQuestionComponent,
        [QUESTION_TYPES.OPTION_LIST]: OptionListQuestionComponent,
        [QUESTION_TYPES.TEXT]: TextQuestionComponent
    };

    const addTextQuestion = () => {
        console.debug("Button add text question. questions size. ", questions.length);
        setQuestions(prevQuestions => [...prevQuestions, {type: QUESTION_TYPES.TEXT, question: "", max: 1, min: 1}]);
    };
    const addBoolQuestion = () => {
        console.debug("Button add bool question");
        setQuestions(prevQuestions => [...prevQuestions, {type: QUESTION_TYPES.BOOLEAN, question: ""}]);
    };
    const addIntegerQuestion = () => {
        console.debug("Button add int question");
        setQuestions(prevQuestions => [...prevQuestions, {type: QUESTION_TYPES.INTEGER, question: "", min: 0, max: 0}]);
    };
    const addOptionListQuestion = () => {
        console.debug("Button add optlist question");
        setQuestions(prevQuestions => [...prevQuestions, {
            type: QUESTION_TYPES.OPTION_LIST,
            question: "",
            options: []
        }]);
    };
    const addOptionItem = (index) => {
        console.debug("Button add option item, index: ", index);
        const allQuestions = [...questions];
        allQuestions[index].options = [...allQuestions[index].options, ''];
        setQuestions(allQuestions);
    };

    const handleTextQuestionChange = (index, event) => {
        const allQuestions = [...questions];
        allQuestions[index].question = event.target.value;
        setQuestions(allQuestions);
    };

    const handleBooleanQuestionChange = (index, event) => {
        const allQuestions = [...questions];
        allQuestions[index].question = event.target.value;
        setQuestions(allQuestions);
    };
    const handleIntegerQuestionChange = (index, event) => {
        const allQuestions = [...questions];
        allQuestions[index].question = event.target.value;
        setQuestions(allQuestions);
    };
    const handleOptionListQuestionChange = (index, event) => {
        const allQuestions = [...questions];
        allQuestions[index].question = event.target.value;
        setQuestions(allQuestions);
    };

    const handleTextMinSizeChange = (index, event) => {
        console.debug("Text Min size change. index: " + index);
        const allQuestions = [...questions];
        allQuestions[index].min = parseInt(event.target.value, 10);
        setQuestions(allQuestions);
    };

    const handleTextMaxSizeChange = (index, event) => {
        console.debug("Text Max size change. index: " + index);
        const allQuestions = [...questions];
        allQuestions[index].max = parseInt(event.target.value, 10);
        setQuestions(allQuestions);
    };

    const handleIntegerMinSizeChange = (index, event) => {
        console.debug("Int Min size change. index: " + index);
        const allQuestions = [...questions];
        allQuestions[index].min = parseInt(event.target.value, 10);
        setQuestions(allQuestions);
    };

    const handleIntegerMaxSizeChange = (index, event) => {
        console.debug("Int Max size change. index: " + index);
        const allQuestions = [...questions];
        allQuestions[index].max = parseInt(event.target.value, 10);
        setQuestions(allQuestions);
    };

    const handleOptionItemTextChange = (qindex, itemindex, event) => {
        console.debug(`handleOptionItemTextChange qindex: ${qindex}. itemindex: ${itemindex}. val: ${event.target.value}`);
        const allQuestions = [...questions];
        allQuestions[qindex].options[itemindex] = event.target.value;
        setQuestions(allQuestions);
    };

    function TextQuestionComponent(index, q, showCtrls) {
        console.debug(`Text component added. index: ${index}. value: ${q}`);
        return (
            <div key={index} style={{marginTop: '10px', marginBottom: '10px', borderStyle: "groove"}}>
                            <textarea value={q.question}
                                      disabled={showCtrls}
                                      placeholder="Type a question (txt)"
                                      onChange={(event) => handleTextQuestionChange(index, event)}/>
                <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                    <div>
                        <label htmlFor="quantity">Min size:</label>
                        <input
                            disabled={showCtrls}
                            onChange={(event) => handleTextMinSizeChange(index, event)}
                            type="number" name="quantity" min="1" value={q.min}
                            max="100" step="1"/>
                    </div>
                    <div>
                        <label htmlFor="quantity">Max:</label>
                        <input disabled={showCtrls}
                               onChange={(event) => handleTextMaxSizeChange(index, event)}
                               type="number" name="quantity" min="1" max="1000" step="1" value={q.max}/>
                    </div>
                </div>
                {
                    !showCtrls &&
                    (<button type="button" onClick={() => removeQuestion(index)} style={{marginLeft: '10px'}}>
                        Remove (txt)
                    </button>)
                }
            </div>
        );
    }

    function BooleanQuestionComponent(index, q, showCtrls) {
        return (
            <div key={index} style={{marginTop: '10px', marginBottom: '10px', borderStyle: "groove"}}>
                            <textarea disabled={showCtrls}
                                      value={q.question} placeholder="Type a question (bool)"
                                      onChange={(event) => handleBooleanQuestionChange(index, event)}
                            />
                <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                    {
                        !showCtrls &&
                        (<button type="button" onClick={() => removeQuestion(index)} style={{marginLeft: '10px'}}>
                            Remove (bool)
                        </button>)
                    }
                </div>
            </div>
        );
    }

    function IntegerQuestionComponent(index, value, showCtrls) {
        return (
            <div key={index} style={{marginTop: '10px', marginBottom: '10px', borderStyle: "groove"}}>
                            <textarea value={value.question}
                                      disabled={showCtrls}
                                      placeholder="Type a question (int)"
                                      onChange={(event) => handleIntegerQuestionChange(index, event)}/>
                <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                    <div>
                        <label htmlFor="quantity">Min:</label>
                        <input
                            disabled={showCtrls}
                            value={value.min}
                            onChange={(event) => handleIntegerMinSizeChange(index, event)}/>
                    </div>
                    <div>
                        <label htmlFor="quantity">Max:</label>
                        <input disabled={showCtrls} value={value.max}
                               onChange={(event) => handleIntegerMaxSizeChange(index, event)}/>
                    </div>
                </div>
                {
                    !showCtrls &&
                    (<button type="button" onClick={() => removeQuestion(index)} style={{marginLeft: '10px'}}>
                        Remove (int)
                    </button>)
                }
            </div>
        );
    }

    function OptionListQuestionComponent(index, value, showCtrls) {
        return (
            <div key={index} style={{marginTop: '10px', marginBottom: '10px', borderStyle: "groove"}}>
                            <textarea
                                disabled={showCtrls}
                                value={value.question} placeholder="Type a question (optlist)"
                                onChange={(event) => handleOptionListQuestionChange(index, event)}/>
                <div key={index} style={{marginTop: '10px', marginBottom: '10px', borderStyle: "ridge"}}>
                    <label>Options</label>
                    <button type="button" disabled={showCtrls} onClick={() => addOptionItem(index)}>Add Option item
                    </button>
                    <div>
                        {
                            questions[index].options.map((optitem, ind) => {
                                console.debug("Option item: " + optitem + ". index: " + ind);
                                return (
                                    <div key={ind} style={{margin: '20px'}}>
                                        <label>{ind}:</label>
                                        <input
                                            disabled={showCtrls}
                                            value={optitem}
                                            onChange={(event) => handleOptionItemTextChange(index, ind, event)}/>
                                        <button disabled={showCtrls} type="button"
                                                onClick={() => removeOptionItem(index, ind)}
                                                style={{margin: '10px'}}>Remove option
                                        </button>
                                    </div>
                                );
                            })
                        }
                    </div>

                </div>
                {
                    !showCtrls &&
                    (<button type="button" onClick={() => removeQuestion(index)} style={{marginLeft: '10px'}}>
                        Remove (optlist)
                    </button>)
                }
            </div>
        );
    }

    function isNonEmptyInteger(nc) {
        if (typeof nc !== "number" || isNaN(nc)) {
            return false;
        }
        return Number.isInteger(nc);
    }

    function hasDuplicates(arr) {
        return !arr.every((item, index) => arr.indexOf(item) === index);
    }

    const isFormValid = () => {
        return name.length > 0 &&
            questions.length > 0 &&
            !questions.some((value) => {
                if (value.question.trim() === '') {
                    return true;
                }
                switch (value.type) {
                    case QUESTION_TYPES.TEXT: {
                        return !isNonEmptyInteger(value.min) ||
                            !isNonEmptyInteger(value.max) ||
                            value.min > value.max ||
                            //(value.min === value.max) ||
                            value.min < 0;
                    }
                    case QUESTION_TYPES.BOOLEAN: {
                        return false;
                    }
                    case QUESTION_TYPES.INTEGER: {
                        return !isNonEmptyInteger(value.min) ||
                            !isNonEmptyInteger(value.max) ||
                            value.min > value.max ||
                            (value.min === value.max);
                    }
                    case QUESTION_TYPES.OPTION_LIST: {
                        return value.options.length < 2 ||
                            value.options.some((opt) => opt.trim() === '') ||
                            hasDuplicates(value.options);
                    }
                }
            });
    };
    const removeQuestion = (index) => {
        console.debug("Removing question ", index);
        const cQuestions = questions.filter((_, i) => i !== index);
        setQuestions(cQuestions);
    };
    const removeOptionItem = (qindex, itemindex) => {
        console.debug(`Removing option item. qindex: ${qindex}. item: ${itemindex}`);
        const updQuestions = [...questions];
        updQuestions[qindex].options = updQuestions[qindex].options.filter((_, i) => i !== itemindex);
        setQuestions(updQuestions);
    };

    const buildSurveyData = (name, description, qTexts) => {
        return {
            name: name,
            description: description,
            userId: 10024,
            timestamp: Date.now(),
            questions: qTexts.map(item => {
                return {...item, required: true};
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isFormValid()) {
                console.error('Invalid form');
                setError('Invalid form');
                return;
            }
            const sbody = buildSurveyData(name, description, questions);
            const bodyStr = JSON.stringify(sbody);
            console.log('Request Body:', bodyStr);
            const respData = await submitSurvey(bodyStr);
            console.log("Created ok. id: " + respData);
            setSubmitResponse(respData);
            sbody.surveyId = respData;
            setSurvey(sbody);
            setMode("view");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSubmitResponse(null);
            console.error("Fetch block error: " + err.message);
        }
    };

    return (
        <div>
            <h1>Survey ({mode})</h1>
            {!survey ?
                (
                    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                        <div>
                            <button type="button" onClick={addTextQuestion}>Add Text Question</button>
                        </div>
                        <div>
                            <button type="button" onClick={addBoolQuestion}>Add Bool Question</button>
                        </div>
                        <div>
                            <button type="button" onClick={addIntegerQuestion}>Add Integer Question</button>
                        </div>
                        <div>
                            <button type="button" onClick={addOptionListQuestion}>Add OptionList Question</button>
                        </div>
                    </div>
                ) :
                (<div>not show</div>)
            }
            {
                survey ?
                    (
                        <div>
                            <p><strong>Survey ID:</strong>{survey.surveyId}</p>
                            <p><strong>User ID:</strong>{survey.userId}</p>
                            <p><strong>Created:</strong>{new Date(survey.timestamp).toLocaleString()}</p>
                        </div>
                    ) : (<div>new survey</div>)
            }
            <form onSubmit={handleSubmit}>
                <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                    <div>
                        <label>Name:</label>
                        <input type="text" value={name}
                               disabled={survey}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label>Description:</label>
                        <input type="text" value={description}
                               disabled={survey}
                               onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                </div>
                {
                    questions.map((q, index) => {
                        console.debug("Iter Question type: " + q.type + ". index: " + index);
                        const Component = questionComponents[q.type];
                        return Component(index, q, survey);
                    })
                }
                {!survey ?
                    (<button type="submit" disabled={!isFormValid()}>Submit Survey</button>) :
                    (<div>not show but</div>)
                }
            </form>

            {submitResponse && (
                <div>
                    <h2>Survey Created Successfully!</h2>
                    <pre>{JSON.stringify(submitResponse, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div style={{color: 'red'}}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
