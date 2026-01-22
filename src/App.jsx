import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import BatchPage from "./pages/BatchPage";
import ResultsPage from "./pages/ResultsPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="dashboard/:jobId" element={<DashboardPage />} />
          <Route path="batch" element={<BatchPage />} />
          <Route path="results/:jobId" element={<ResultsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;