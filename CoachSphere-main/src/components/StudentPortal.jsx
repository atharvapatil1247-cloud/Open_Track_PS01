import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentAcademicHub from './StudentAcademicHub';
import StudentSchedule from './StudentSchedule';
import StudentFeePassbook from './StudentFeePassbook';
import StudentDoubts from './StudentDoubts';
import Header from './Header';
import { Check, X } from 'lucide-react';

export default function StudentPortal({ onLogout, onNavigateToLanding, onSwitchRole = () => {}, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'schedule' | 'fees' | 'doubts'
  const [toast, setToast] = useState({ show: false, message: '' });

  const logoutHandler = onLogout || onNavigateToLanding;

  const showNotification = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased">
      {/* 1. Header with role set to student */}
      <Header
        role="student"
        onRoleChange={onSwitchRole}
        onNavigateToLanding={logoutHandler}
        onLogout={logoutHandler}
        user={user}
      />

      {/* 2. Student Collapsible Sidebar */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onLogout={logoutHandler}
      />

      {/* 3. Main Workspace Area */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        }`}
      >
        <main className="w-full min-h-screen pt-20 px-4 sm:px-8 py-6">
          {activeTab === 'hub' && <StudentAcademicHub onShowToast={showNotification} />}
          {activeTab === 'schedule' && <StudentSchedule onShowToast={showNotification} />}
          {activeTab === 'fees' && <StudentFeePassbook onShowToast={showNotification} />}
          {activeTab === 'doubts' && <StudentDoubts onShowToast={showNotification} />}
        </main>
      </div>

      {/* 4. Global Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out max-w-md rounded-xl bg-[#091426] text-white p-3 shadow-xl flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#00301e] text-[#4edea3] flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 pr-3">
            <span className="text-xs font-semibold text-white">Student Portal</span>
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
      )}
    </div>
  );
}