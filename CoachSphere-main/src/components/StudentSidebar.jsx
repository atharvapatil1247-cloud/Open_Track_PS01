import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Wallet,
  HelpCircle,
  Menu,
  ChevronLeft,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function StudentSidebar({
  isOpen = true,
  onToggle,
  activeTab = 'hub',
  onSelectTab = () => {},
  onLogout = () => {}
}) {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const isExpanded = onToggle !== undefined ? isOpen : internalExpanded;

  const toggleSidebar = () => {
    if (onToggle) onToggle();
    else setInternalExpanded((prev) => !prev);
  };

  const navItems = [
    {
      id: 'hub',
      label: 'My Academic Hub',
      sub: 'Attendance & Sprint Pacing',
      icon: GraduationCap
    },
    {
      id: 'schedule',
      label: 'Class & Lab Slots',
      sub: 'Terminals, Rooms & Zoom',
      icon: Clock
    },
    {
      id: 'fees',
      label: 'Fee Passbook',
      sub: 'UPI Invoices & GST Receipts',
      icon: Wallet
    },
    {
      id: 'doubts',
      label: 'Faculty Doubt Slots',
      sub: 'Book 1:1 Code Reviews',
      icon: HelpCircle
    }
  ];

  return (
    <>
      {isExpanded && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between py-4 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72 translate-x-0' : 'w-20 translate-x-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-3 px-3 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center justify-between px-2 py-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider text-[#45474c] transition-opacity duration-200 whitespace-nowrap ${
                isExpanded ? 'opacity-100' : 'opacity-0 hidden'
              }`}
            >
              Learner Portal
            </span>
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-[#45474c] hover:text-[#091426] hover:bg-[#eff4ff] transition-all cursor-pointer mx-auto lg:mx-0"
            >
              {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 w-full text-left cursor-pointer ${
                    isExpanded ? 'px-3 py-2.5 gap-3' : 'justify-center p-3'
                  } ${
                    isActive
                      ? 'bg-[#1e293b] text-white font-semibold shadow-sm'
                      : 'text-[#45474c] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                  }`}
                >
                  <Icon
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isExpanded ? 'w-5 h-5' : 'w-6 h-6'
                    } ${isActive ? 'text-indigo-400' : 'text-[#45474c]'}`}
                  />
                  {isExpanded && (
                    <div className="flex flex-col min-w-0 overflow-hidden text-left">
                      <span className="text-xs leading-tight truncate">{item.label}</span>
                      <span className="text-[10px] opacity-80 font-normal truncate mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pt-3 flex flex-col gap-2 border-t border-slate-100">
          {isExpanded ? (
            <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900">
                  Student Verification
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                  Gate Qualified
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-[11px] text-indigo-950 font-medium truncate">
                  Attendance &ge; 80% Validated
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2.5 rounded-xl bg-indigo-50 text-indigo-600 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            className={`group relative flex items-center rounded-xl transition-all duration-200 w-full text-left cursor-pointer text-slate-600 hover:text-rose-600 hover:bg-rose-50 ${
              isExpanded ? 'px-3 py-2.5 gap-3' : 'justify-center p-3'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-rose-600 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {isExpanded && (
              <div className="flex flex-col min-w-0 overflow-hidden text-left">
                <span className="text-xs font-semibold leading-tight">Sign out</span>
                <span className="text-[10px] text-slate-400 group-hover:text-rose-400 truncate mt-0.5">
                  End student session
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}