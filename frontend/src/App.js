import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorSearch from './pages/DoctorSearch';
import DoctorDetail from './pages/DoctorDetail';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './pages/Chatbot';
import { AnimatePresence, motion } from 'framer-motion';
import FindHospital from './pages/FindHospital';
import NurseSearch from './pages/NurseSearch';
import BookNurseAppointment from './pages/BookNurseAppointment';

const PageTransitionWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransitionWrapper><Login /></PageTransitionWrapper>} />
        <Route path="/register" element={<PageTransitionWrapper><Register /></PageTransitionWrapper>} />
        <Route path="/" element={
          <ProtectedRoute>
            <PageTransitionWrapper><Dashboard /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PageTransitionWrapper><DoctorSearch /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/doctors/:id" element={
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PageTransitionWrapper><DoctorDetail /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <PageTransitionWrapper><Appointments /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/find-hospital" element={
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PageTransitionWrapper><FindHospital /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/book-appointment/:doctorId" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PageTransitionWrapper><BookAppointment /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/nurses" element={
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PageTransitionWrapper><NurseSearch /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/book-nurse/:nurseId" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PageTransitionWrapper><BookNurseAppointment /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/ai-chatbot" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PageTransitionWrapper><Chatbot /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageTransitionWrapper><AdminDashboard /></PageTransitionWrapper>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <Navbar />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

