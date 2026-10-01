import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HealthInputPage from './pages/HealthInputPage';
import ReportUploadPage from './pages/ReportUploadPage';
import PredictionResultPage from './pages/PredictionResultPage';
import RecommendationsPage from './pages/RecommendationsPage';
import HistoryPage from './pages/HistoryPage';
import ReportHistoryPage from './pages/ReportHistoryPage';
import ProfilePage from './pages/ProfilePage';
import DoctorFinderPage from './pages/DoctorFinderPage';
import ChatbotPage from './pages/ChatbotPage';
import PpgMeasurementPage from './pages/PpgMeasurementPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

// Public Route Guard (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem('access_token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Interactive Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-input"
          element={
            <ProtectedRoute>
              <HealthInputPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-report"
          element={
            <ProtectedRoute>
              <ReportUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prediction/:id"
          element={
            <ProtectedRoute>
              <PredictionResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <DoctorFinderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ppg"
          element={
            <ProtectedRoute>
              <PpgMeasurementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model-performance"
          element={
            <ProtectedRoute>
              <ModelPerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
