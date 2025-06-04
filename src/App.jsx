import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import GithubPage from "./pages/githubPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GithubPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
