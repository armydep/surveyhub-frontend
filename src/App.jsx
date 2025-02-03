import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Surveys from "./pages/Surveys";
import CreateSurvey from "./pages/CreateSurvey";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Surveys />} />
          <Route exact path="/CreateSurvey" element={<CreateSurvey />} />
          {/*<Route path="/survey/:id" element={<SurveyPage />} />*/}
        </Routes>
      </Router>
    </>
  );
}