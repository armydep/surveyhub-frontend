import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";
import Survey from "./components/Survey.jsx";
import Answer from "./components/Answer.jsx";
import SurveyAnswers from "./components/SurveyAnswers.jsx";
import Layout from "./components/Layout.jsx"
import WalletLogin from "./components/wallet/WalletLogin.jsx"
import WalletHome from "./components/wallet/WalletHome.jsx";

export default function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route exact path="/home" element={<Home/>}/>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/survey" element={<Survey/>}/>
                        <Route exact path="/survey/answer/:surveyId" element={<Survey/>}/>
                        <Route exact path="/survey/:surveyId" element={<Survey/>}/>
                        <Route exact path="/answer/:answerId" element={<Answer/>}/>
                        <Route exact path="/answer/survey/:surveyId" element={<SurveyAnswers/>}/>
                        <Route exact path="/wallet/login" element={<WalletLogin/>}/>
                        <Route exact path="/wallet/home" element={<WalletHome/>}/>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}