import React, { useState } from 'react';
import TutorSidebar from './TutorSidebar';
import TutorDeck from './TutorDesk';
import TutorAttendance from './TutorAttendance';
import TutorSchedule from './TutorSchedule';
import TutorInterventions from './TutorInterventions';
import Dashboardcontent from './DashboardContent';
import Header from './Header';
import { Check, X } from 'lucide-react';

export default function TutorDashboard({ onNavigateToLanding, onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('copilot'); // 'copilot' | 'deck' | 'attendance' | 'schedule' | 'interventions'
  const [toast, setToast] = useState({ show: false, message: '' });

  const showNotification = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased">
      {/* 1. Header with Role set to 'trainer' */}
      <Header
        role="trainer"
        onRoleChange={() => {}}
        onNavigateToLanding={onNavigateToLanding}
        onLogout={onLogout}
        user={user}
      />

      {/* 2. Tutor Collapsible Sidebar */}
      <TutorSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onLogout={onLogout}
      />

      {/* 3. Main Content Container (Padded dynamically based on sidebar state) */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        }`}
      >
        <main className="w-full min-h-screen pt-20 px-4 sm:px-8 py-6">
          {activeTab === 'copilot' && (
            <Dashboardcontent
              role={user?.role || user?.user_role || 'tutor'}
              isTrainer
              user={user}
              onShowToast={showNotification}
            />
          )}

          {activeTab === 'deck' && (
            <TutorDeck onShowToast={showNotification} />
          )}

          {activeTab === 'attendance' && (
            <TutorAttendance onShowToast={showNotification} />
          )}

          {activeTab === 'schedule' && (
            <TutorSchedule onShowToast={showNotification} />
          )}

          {activeTab === 'interventions' && (
            <TutorInterventions onShowToast={showNotification} />
          )}
        </main>
      </div>

      {/* 4. Global Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out max-w-md rounded-xl bg-[#091426] text-white p-3 shadow-xl flex items-center gap-3 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-8 w-8 rounded-lg bg-[#00301e] text-[#4edea3] flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 pr-3">
          <span className="text-xs font-semibold text-white">Faculty Console</span>
          <span className="text-[11px] text-[#bcc7de] truncate">{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={() => setToast({ show: false, message: '' })}
          className="p-1 text-[#bcc7de] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}