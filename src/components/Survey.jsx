import {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {fetchSurveyById, submitAnswers, submitSurvey} from "../api/api.js";


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

    const [answers, setAnswers] = useState([]);

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
    }, []);

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
            setAnswers(survey.questions.map((qst) => ({type: qst.type, value: ''})));
        }
    }, [survey]);

    useEffect(() => {
        console.log(`Survey. Mode: ${mode}. ${surveyId}. survey: ${JSON.stringify(survey)}`);
        if (mode === "answer") {
            console.log("In useEffect [survey]. mode: ", mode);
        }
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

    const handleAnswerChange = (index, event) => {
        const allAnswers = [...answers];
        allAnswers[index].value = event.target.value;
        setAnswers(allAnswers);
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

    function TextQuestionComponent(index, q, showCtrls, showAnswer, answer) {
        console.debug(`Text component added. index: ${index}. value: ${q}`);
        return (
            <div key={index} style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>

                <div style={{borderStyle: "groove"}}>
                    <div>question (text)</div>
                    <textarea value={q.question}
                              disabled={showCtrls}
                              placeholder="Type a question (txt)"
                              onChange={(event) => handleTextQuestionChange(index, event)}/>
                    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                        <div>
                            <label htmlFor="quantity">Min size:</label>
                            <input
                                disabled={showCtrls}
                                className="visible-spinners"
                                onChange={(event) => handleTextMinSizeChange(index, event)}
                                type="number" name="quantity" min="1" value={q.min}
                                max="100" step="1"/>
                        </div>
                        <div>
                            <label htmlFor="quantity">Max:</label>
                            <input disabled={showCtrls}
                                   className="visible-spinners"
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
                {
                    showAnswer &&
                    (<div
                        style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                        <div>answer (text)</div>
                        <textarea
                            disabled={!showAnswer}
                            value={answer.value} placeholder="Type an answer (txt)"
                            onChange={(event) => handleAnswerChange(index, event)}
                        />
                    </div>)
                }
            </div>
        );
    }

    function BooleanQuestionComponent(index, qst, showCtrls, showAnswer, answer) {
        return (
            <div key={index} style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                <div style={{borderStyle: "groove"}}>
                    <div>question (bool)</div>
                    <textarea disabled={showCtrls}
                              value={qst.question} placeholder="Type a question (bool)"
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
                {
                    showAnswer && (
                        <div style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                            <div>answer (bool)</div>
                            <label key={'b1'}>
                                <input
                                    type="radio"
                                    name={`options-${index}-true`}
                                    value="true"
                                    checked={answer.value === 'true'}
                                    onChange={(e) => handleAnswerChange(index, e)}
                                />
                                true
                            </label>
                            <br/>
                            <label key={'b2'}>
                                <input
                                    type="radio"
                                    name={`options-${index}-false`}
                                    value="false"
                                    checked={answer.value === 'false'}
                                    onChange={(e) => handleAnswerChange(index, e)}
                                />
                                false
                            </label>
                            <br/>
                            <p>Selected Option: {answer.value}</p>
                        </div>)
                }
            </div>
        );
    }

    function IntegerQuestionComponent(index, value, showCtrls, showAnswer, answer) {
        return (
            <div key={index} style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                <div style={{borderStyle: "groove"}}>
                    <div>question (int)</div>
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
                                type="number"
                                className="visible-spinners"
                                onChange={(event) => handleIntegerMinSizeChange(index, event)}/>
                        </div>
                        <div>
                            <label htmlFor="quantity">Max:</label>
                            <input disabled={showCtrls} value={value.max}
                                   type="number"
                                   className="visible-spinners"
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
                {
                    showAnswer && (
                        <div style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                            <div>answer (int)</div>
                            <input disabled={!showAnswer}
                                   onChange={(event) => handleAnswerChange(index, event)}
                                   value={answer.value}
                                   type="number" name="quantity" min="1" max="1000" step="1"/>
                        </div>)
                }

            </div>
        );
    }

    function OptionListQuestionComponent(index, value, showCtrls, showAnswer, answer) {
        return (
            <div key={index} style={{display: "flex", gap: "10px", marginBottom: "20px", borderStyle: "groove"}}>
                <div style={{borderStyle: "groove"}}>
                    <div>question (optlist)</div>
                    <textarea
                        disabled={showCtrls}
                        value={value.question} placeholder="Type a question (optlist)"
                        onChange={(event) => handleOptionListQuestionChange(index, event)}/>
                    <div style={{marginTop: '10px', marginBottom: '10px', borderStyle: "ridge"}}>
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
                {
                    showAnswer &&
                    (
                        <div>
                            <div>answer (optlist)</div>
                            {questions[index].options.map((opt, ind) => {
                                const isChecked = (answer.value === (value.options.indexOf(opt)));
                                console.log("Opt list items: " + opt + ". isChecked:" + isChecked + ". qst: " + JSON.stringify(value));
                                return (
                                    <label key={ind}>
                                        <input
                                            type="radio"
                                            name={`options-${index}-${ind}`}
                                            value={opt}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    handleAnswerChange(index, {target: {value: ind}});
                                                } else {
                                                    //handleAnswerChange(index, {target: {value: ind}});
                                                }
                                            }}
                                        />
                                        {opt}
                                    </label>
                                )
                            })}
                        </div>
                    )
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

    function isValidTextAnswer(answer, index) {
        const isValid = answer.value.length >= questions[index].min &&
            answer.value.length <= questions[index].max;
        console.log("isValid txt answer: " + isValid + ". " + JSON.stringify(answer) + ". index: " + index);
        return isValid;
    }

    function isValidIntegerAnswer(answer, index) {
        const isValid = answer.value >= questions[index].min &&
            answer.value <= questions[index].max;
        console.log("isValid int answer: " + isValid + ". " + JSON.stringify(answer) + ". index: " + index);
        return isValid;
    }

    function isValidBooleanAnswer(answer, index) {
        const isValid = (answer.value === 'true' || answer.value === 'false');
        console.log("isValid bool answer: " + isValid + ". " + JSON.stringify(answer) + ". index: " + index);
        return isValid;
    }

    function isValidOptionListAnswer(answer, index) {
        const isValid = (isNonEmptyInteger(answer.value) && answer.value >= 0 && answer.value < questions[index].options.length);
        console.log("isValid opt list answer: " + isValid + ". " + JSON.stringify(answer) + ". index: " + index);
        return isValid;
    }

    const isAnswersValid = () => {
        const isValid = answers.every((ans, index) => {
            let isVal;
            switch (ans.type) {
                case QUESTION_TYPES.TEXT: {
                    isVal = isValidTextAnswer(ans, index);
                    break;
                }
                case QUESTION_TYPES.INTEGER: {
                    isVal = isValidIntegerAnswer(ans, index);
                    break;
                }
                case QUESTION_TYPES.BOOLEAN: {
                    isVal = isValidBooleanAnswer(ans, index);
                    break;
                }
                case QUESTION_TYPES.OPTION_LIST: {
                    isVal = isValidOptionListAnswer(ans, index);
                    break;
                }
                default : {
                    isVal = false;
                }
            }
            return isVal && ans.type === questions[index].type;
        });
        console.log("IsValid: " + isValid + ". ans: " + answers.length + ". qst: " + questions.length);
        return isValid && questions.length === answers.length;
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

    const submitSurveyAnswers = async (e) => {
        try {
            console.log('Submit answers button:', e);
            if (!isAnswersValid()) {
                console.error('Invalid answers form');
                setError('Invalid answers form');
                return;
            }

            const answersBody = {
                userId: 20024,
                surveyId: surveyId,
                timestamp: Date.now(),
                answers: answers
            }
            const respData = await submitAnswers(answersBody);
            console.log("Answers submitted ok. id: " + respData);
            setSubmitResponse(respData);
            //setMode("view");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSubmitResponse(null);
            console.error("Submit answers error: " + err.message);
        }
    };


    const renderSubmitButton = () => {
        switch (mode) {
            case 'create':
                return <button type="submit" disabled={!isFormValid()}>Create Survey</button>;
            case 'view':
                return <div>View Mode</div>;
            case 'answer':
                return <button onClick={submitSurveyAnswers}
                               type="button" disabled={!isAnswersValid()}>Submit Answers</button>;
            default:
                return <div>Unknown Mode</div>;
        }
    };

    return (<div>
            <h1>Survey ({mode})</h1>
            {!survey ?
                (<div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
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
                </div>) : (<div>not show</div>)
            }
            {
                survey ?
                    (<div>
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
                    questions.map((qst, index) => {
                        const Component = questionComponents[qst.type];
                        return Component(index, qst, survey, mode === 'answer', answers[index]);
                    })
                }
                {renderSubmitButton()}
            </form>
            {submitResponse &&
                (<div>
                    <h2>Submitted Successfully!</h2>
                    <pre>{JSON.stringify(submitResponse, null, 2)}</pre>
                </div>)
            }
            {
                error &&
                (<div style={{color: 'red'}}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>)
            }
        </div>
    );
};
