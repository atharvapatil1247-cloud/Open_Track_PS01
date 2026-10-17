import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboardcontent from './DashboardContent';
import TimetableRescheduler from './TimetableRescheduler';
import Attendance from './Attendance';
import FeeReconcile from './FeeReconcile'
import TutorDashboard from './TutorDashboard'
import MemberInvitations from './MemberInvitations';
import InstituteSetup from './InstituteSetup';

export default function Dashboard({ initialRole = 'trainer', onNavigateToLanding, onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState(initialRole);

  // 1. Tab state: matches the 'id' in Sidebar.jsx navItems
  const [activeTab, setActiveTab] = useState('copilot');
  const [toast, setToast] = useState('');
  const showNotification = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 4000);
  };
  if (role === 'trainer') {
    return (
      <TutorDashboard
        onNavigateToLanding={onNavigateToLanding}
        onLogout={onLogout}
        onSwitchRole={(newRole) => setRole(newRole)}
        user={user}
      />
    );
  }
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <Header
        role={role}
        onRoleChange={setRole}
        onNavigateToLanding={onNavigateToLanding}
        onLogout={onLogout}
        user={user}
      />

      {/* 2. Pass activeTab and onSelectTab to Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onLogout={onLogout}
      />

      {/* 3. Main dynamic viewport with responsive padding */}
      <div className={`w-full transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <main className="w-full min-h-screen pt-20 px-4 sm:px-8 py-6">

          {/* TAB 1: Copilot Center */}
          {activeTab === 'copilot' && (
            <Dashboardcontent
              role={role}
              isTrainer={role === 'trainer'}
              onRoleChange={setRole}
              user={user}
              onShowToast={showNotification}
            />
          )}

          {/* TAB 2: Timetable & Rescheduler */}
          {activeTab === 'invitations' && (
            <MemberInvitations
              onShowToast={showNotification}
            />
          )}

          {activeTab === 'institute-setup' && (
            <InstituteSetup onShowToast={showNotification} />
          )}

          {/* TAB 3: Timetable & Rescheduler */}
          {activeTab === 'timetable' && (
            <TimetableRescheduler
              onShowToast={showNotification}
            />
          )}

          {/* TAB 3: Batches & Attendance */}
          {activeTab === 'attendance' && (
            <Attendance
              onShowToast={showNotification} />
          )}

          {/* TAB 4: Fees & Auto-Reconcile */}
          {activeTab === 'fees' && (
            <FeeReconcile
              onShowToast={showNotification} />
          )}

        </main>
      </div>
      <div
        className={`fixed bottom-5 right-4 z-50 max-w-[calc(100vw-2rem)] rounded-xl bg-[#091426] px-4 py-3 text-xs text-white shadow-xl transition-all ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
          }`}
      >
        {toast}
      </div>
    </div>
  );
}