import React, { useState } from 'react';
import {
  Brain,
  UserPlus,
  Building2,
  Calendar,
  Users,
  Wallet,
  ShieldCheck,
  Menu,
  ChevronLeft,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  isOpen = true,
  onToggle,
  activeTab = 'copilot',
  onSelectTab = () => {},
  onLogout = () => {}
}) {
  // Fallback to internal state if no external drawer controller is passed
  const [internalExpanded, setInternalExpanded] = useState(true);
  const isExpanded = onToggle !== undefined ? isOpen : internalExpanded;

  const toggleSidebar = () => {
    if (onToggle) onToggle();
    else setInternalExpanded((prev) => !prev);
  };

  // Standard static workflows
  const navItems = [
    {
      id: 'copilot',
      label: 'Copilot Center',
      sub: 'SQL Inspect & HITL Approvals',
      icon: Brain
    },
    {
      id: 'institute-setup',
      label: 'Institute Setup',
      sub: 'Branches, Courses & Batches',
      icon: Building2
    },
    {
      id: 'invitations',
      label: 'Invite Members',
      sub: 'Students & Tutors',
      icon: UserPlus
    },
    {
      id: 'timetable',
      label: 'Timetable & Rescheduler',
      sub: 'Rooms & Trainer Availability',
      icon: Calendar
    },
    {
      id: 'attendance',
      label: 'Batches & Attendance',
      sub: 'QR Check-in & Meet Vault',
      icon: Users
    },
    {
      id: 'fees',
      label: 'Fees & Auto-Reconcile',
      sub: 'UPI/Bank Logs & EMI Aging',
      icon: Wallet
    },
  ];

  return (
    <>
      {/* 1. Mobile Backdrop: Tap outside to close drawer on small screens */}
      {isExpanded && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* 2. Main Collapsible Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between py-4 transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'w-72 translate-x-0'
            : 'w-20 translate-x-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Section Label, Drawer Toggle, and Navigation Links */}
        <div className="flex flex-col gap-3 px-3 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center justify-between px-2 py-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider text-[#45474c] transition-opacity duration-200 whitespace-nowrap ${
                isExpanded ? 'opacity-100' : 'opacity-0 hidden'
              }`}
            >
              Mission Workflows
            </span>

            {/* Toggle Drawer Trigger (Hamburger / Chevron) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-[#45474c] hover:text-[#091426] hover:bg-[#eff4ff] transition-all cursor-pointer mx-auto lg:mx-0"
              title={isExpanded ? 'Collapse menu' : 'Expand menu'}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
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
                  {/* Icon */}
                  <Icon
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isExpanded ? 'w-5 h-5' : 'w-6 h-6'
                    } ${isActive ? 'text-indigo-400' : 'text-[#45474c]'}`}
                  />

                  {/* Expanded Text Labels */}
                  {isExpanded && (
                    <div className="flex flex-col min-w-0 overflow-hidden text-left">
                      <span className="text-xs leading-tight truncate">{item.label}</span>
                      <span className="text-[10px] opacity-80 font-normal truncate mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  )}

                  {/* Collapsed Hover Tooltip (Gemini Style) */}
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

        {/* 3. Bottom Section: Sovereign Runtime Telemetry + Log Out Button */}
        <div className="px-3 pt-3 flex flex-col gap-2 border-t border-slate-100">
          {/* Runtime Telemetry Pill */}
          {isExpanded ? (
            <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1.5 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#45474c]">
                  Sovereign Runtime
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#00a472]">v2.4.12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a472] shrink-0" />
                <span className="text-[11px] text-[#45474c] truncate">
                  AST Guard Rails Enforced
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-[#dce9ff] overflow-hidden">
                <div className="h-full w-full bg-[#00a472]" />
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center p-2.5 rounded-xl bg-[#eff4ff] text-[#00a472] cursor-pointer"
              title="Sovereign Runtime v2.4.12 • AST Guard Enforced"
            >
              <ShieldCheck className="w-4 h-4 text-[#00a472]" />
            </div>
          )}

          {/* Log Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className={`group relative flex items-center rounded-xl transition-all duration-200 w-full text-left cursor-pointer text-slate-600 hover:text-rose-600 hover:bg-rose-50 ${
              isExpanded ? 'px-3 py-2.5 gap-3' : 'justify-center p-3'
            }`}
          >
            <LogOut
              className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-rose-600 transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            {isExpanded && (
              <div className="flex flex-col min-w-0 overflow-hidden text-left">
                <span className="text-xs font-semibold leading-tight">Sign out</span>
                <span className="text-[10px] text-slate-400 group-hover:text-rose-400 truncate mt-0.5">
                  End current session
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