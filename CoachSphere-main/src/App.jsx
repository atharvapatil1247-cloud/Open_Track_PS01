// src/App.jsx
import React, { useEffect, useState } from 'react';
import Landing from './components/Landing.jsx';
import Auth from './components/Auth.jsx';
import DirectorDashboard from './components/Dashboard.jsx';
import TutorDashboard from './components/TutorDashboard.jsx';
import StudentPortal from './components/StudentPortal.jsx';
import { apiRequest, clearSession } from './api/client';
import { CheckCircle, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [currentRole, setCurrentRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRestoringSession, setIsRestoringSession] = useState(() =>
    Boolean(localStorage.getItem('access_token'))
  );
  const [sessionRestoreError, setSessionRestoreError] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return;
    }

    apiRequest('/api/auth/me')
      .then((user) => {
        setCurrentUser(user);
        setCurrentRole(normalizeRole(user));
        setCurrentPage('dashboard');
      })
      .catch(() => {
        clearSession();
        setSessionRestoreError('Your session expired. Please sign in again.');
      })
      .finally(() => {
        setIsRestoringSession(false);
      });
  }, []);

  const handleLoginSuccess = (user, message = 'Signed in successfully.') => {
    setCurrentUser(user);
    setCurrentRole(normalizeRole(user));
    setCurrentPage('dashboard');
    setNotification({ type: 'success', message });
    window.setTimeout(() => setNotification(null), 5000);
  };

  const handleRoleSwitch = (newRole) => {
    setCurrentRole(newRole.toLowerCase().trim());
  };

  const handleSignOut = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentRole(null);
    setCurrentPage('auth');
    setSessionRestoreError('');
  };

  if (isRestoringSession) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="text-sm text-slate-600">Restoring your session...</div>
      </div>
    );
  }

  const isTrainerRole =
    currentRole === 'trainer' ||
    currentRole === 'tutor' ||
    currentRole === 'faculty';

  const isStudentRole =
    currentRole === 'student' ||
    currentRole === 'learner';

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {notification && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[1000] flex max-w-md items-center gap-3 rounded-xl bg-[#091426] p-4 text-white shadow-xl"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-[#4edea3]" />
          <span className="text-sm">{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-auto text-slate-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {currentPage === 'landing' && (
        <Landing
          onNavigateToDashboard={() => setCurrentPage('auth')}
          onDirectLogin={() => setCurrentPage('auth')}
        />
      )}

      {currentPage === 'auth' && (
        <Auth
          onLoginSuccess={handleLoginSuccess}
          onNavigateToLanding={handleSignOut}
          initialMessage={sessionRestoreError}
        />
      )}

      {currentPage === 'dashboard' && currentUser && (
        <div className="w-full">
          {isStudentRole ? (
            <StudentPortal
              onLogout={handleSignOut}
              onNavigateToLanding={handleSignOut}
              onSwitchRole={handleRoleSwitch}
              user={currentUser}
            />
          ) : isTrainerRole ? (
            <TutorDashboard
              onLogout={handleSignOut}
              onNavigateToLanding={handleSignOut}
              onSwitchRole={handleRoleSwitch}
              user={currentUser}
            />
          ) : (
            <DirectorDashboard
              initialRole={currentRole}
              onRoleChange={handleRoleSwitch}
              onLogout={handleSignOut}
              onNavigateToLanding={handleSignOut}
              user={currentUser}
            />
          )}
        </div>
      )}
    </div>
  );
}

function normalizeRole(user) {
  const role = user?.role || user?.user_role || user?.type || 'student';
  return String(role).toLowerCase().trim();
}