import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import BatchPage from "./pages/BatchPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="dashboard/:jobId" element={<DashboardPage />} />
          <Route path="batch" element={<BatchPage />} />
          <Route path="results/:jobId" element={<ResultsPage />} />
        </Route>

          <Route path="history" element={<HistoryPage />} />

      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
