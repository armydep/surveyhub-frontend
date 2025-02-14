import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";
import Survey from "./components/Survey.jsx";
import Layout from "./components/Layout.jsx"

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
                    </Route>
                </Routes>
            </Router>
        </>
    );
}