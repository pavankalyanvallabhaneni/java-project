import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Candidate Pages
import CandidateDashboardPage from './pages/candidate/CandidateDashboardPage';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage';
import CandidateSavedJobsPage from './pages/candidate/CandidateSavedJobsPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';

// Recruiter Pages
import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import RecruiterPostJobPage from './pages/recruiter/RecruiterPostJobPage';
import RecruiterApplicantsPage from './pages/recruiter/RecruiterApplicantsPage';
import RecruiterInterviewsPage from './pages/recruiter/RecruiterInterviewsPage';
import RecruiterCompanyPage from './pages/recruiter/RecruiterCompanyPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Candidate Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                <CandidateDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                <CandidateProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/applications"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                <CandidateApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/saved"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                <CandidateSavedJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/interviews"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                <CandidateInterviewsPage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterPostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterPostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/interviews"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterInterviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/company"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                <RecruiterCompanyPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminCompaniesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminAuditLogsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
