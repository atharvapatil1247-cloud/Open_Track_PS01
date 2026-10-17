import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  CheckSquare,
  Calendar,
  HelpCircle,
  ShieldCheck,
  Menu,
  ChevronLeft,
  LogOut
} from 'lucide-react';

export default function TutorSidebar({
  isOpen = true,
  onToggle,
  activeTab = 'deck',
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
      id: 'copilot',
      label: 'Copilot Center',
      sub: 'Ask & review actions',
      icon: Brain
    },
    {
      id: 'deck',
      label: 'My Teaching Deck',
      sub: 'Active Cohorts & Daily Schedule',
      icon: BookOpen
    },
    {
      id: 'attendance',
      label: 'Take Attendance',
      sub: 'QR Check-in & Meet Vault',
      icon: CheckSquare
    },
    {
      id: 'schedule',
      label: 'Lab & Room Schedule',
      sub: 'Workstations & Clash Swaps',
      icon: Calendar
    },
    {
      id: 'interventions',
      label: 'Interventions & PRs',
      sub: '1:1 Doubts & Git Code Reviews',
      icon: HelpCircle
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isExpanded && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Drawer Container */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between py-4 transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'w-72 translate-x-0'
            : 'w-20 translate-x-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-3 px-3 overflow-y-auto overflow-x-hidden">
          {/* Header Strip */}
          <div className="flex items-center justify-between px-2 py-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider text-[#45474c] transition-opacity duration-200 whitespace-nowrap ${
                isExpanded ? 'opacity-100' : 'opacity-0 hidden'
              }`}
            >
              Faculty Workflows
            </span>

            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-[#45474c] hover:text-[#091426] hover:bg-[#eff4ff] transition-all cursor-pointer mx-auto lg:mx-0"
              title={isExpanded ? 'Collapse menu' : 'Expand menu'}
            >
              {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Items */}
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

                  {!isExpanded && (
                    <div className="absolute left-full ml-3 hidden group-hover:flex flex-col rounded-lg bg-[#091426] text-white px-3 py-1.5 shadow-xl z-50 whitespace-nowrap text-left pointer-events-none">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-[#bcc7de]">{item.sub}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Fee-Blind RBAC Sandbox Indicator & Logout */}
        <div className="px-3 pt-3 flex flex-col gap-2 border-t border-slate-100">
          {isExpanded ? (
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-1.5 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                  Privacy Sandbox
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                  Level 2 (Fee-Blind)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-emerald-900 font-medium truncate">
                  Financial Data Scrubbed
                </span>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center p-2.5 rounded-xl bg-emerald-50 text-emerald-600 cursor-pointer"
              title="Fee-Blind Sandbox Active (Level 2 Pedagogical Clearance)"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {/* Logout Button */}
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
                  End teaching session
                </span>
              </div>
            )}

            {!isExpanded && (
              <div className="absolute left-full ml-3 hidden group-hover:flex flex-col rounded-lg bg-slate-900 text-white px-3 py-1.5 shadow-xl z-50 whitespace-nowrap text-left pointer-events-none">
                <span className="text-xs font-semibold text-rose-300">Sign out</span>
                <span className="text-[10px] text-slate-400">End session</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}