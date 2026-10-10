import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VocabularyReview from './pages/VocabularyReview';
import DailyLesson from './pages/DailyLesson';
import PlacementTest from './pages/PlacementTest';
import Onboarding from './pages/Onboarding';
import PracticeLab from './pages/PracticeLab';

const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/review" element={<ProtectedRoute><VocabularyReview /></ProtectedRoute>} />
      <Route path="/lesson" element={<ProtectedRoute><DailyLesson /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeLab /></ProtectedRoute>} />
      <Route path="/placement" element={<ProtectedRoute><PlacementTest /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
