import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Surveys from "./pages/Surveys";
import CreateSurvey from "./pages/CreateSurvey";
import ShowSurvey from "./pages/ShowSurvey";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Surveys />} />
          <Route exact path="/new" element={<CreateSurvey />} />
          <Route exact path="/survey/:surveyId" element={<ShowSurvey />} />
        </Routes>
      </Router>
    </>
  );
}