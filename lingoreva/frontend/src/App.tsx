import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import RouteSeo from './components/RouteSeo';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VocabularyReview = lazy(() => import('./pages/VocabularyReview'));
const DailyLesson = lazy(() => import('./pages/DailyLesson'));
const PlacementTest = lazy(() => import('./pages/PlacementTest'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const PracticeLab = lazy(() => import('./pages/PracticeLab'));

const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200" role="status" aria-live="polite">
              Loading Lingoreva…
            </div>
          }
        >
          <RouteSeo />
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
