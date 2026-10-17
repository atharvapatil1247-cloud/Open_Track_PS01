import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';

export default function Header({ role, onRoleChange, onNotify, onLogout = () => {}, user }) {
  const displayName = user?.full_name || user?.name || user?.email || 'User';
  const displayRole = user?.role || user?.user_role || role || 'User';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full h-16 px-6 flex items-center justify-between gap-4">
        {/* Brand & RBAC Clearance Selectors */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#091426] flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15px] text-[#091426] tracking-tight">Coach Sphere</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1e293b] text-white font-bold uppercase tracking-wider">
                  Ops Copilot
                </span>
              </div>
              <span className="text-[10px] text-[#45474c]">Academy operations platform</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-4 h-4 text-[#45474c] pointer-events-none" />
            <input
              className="w-full h-8 pl-9 pr-12 rounded-xl bg-[#eff4ff] text-[#0b1c30] placeholder:text-[#45474c] text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#4b41e1] transition-all"
              placeholder="Query student, SQL audit, clash replanner or ledger..."
              type="text"
            />
            <span className="absolute right-3 text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#dce9ff] text-[#45474c]">
              ⌘K
            </span>
          </div>
        </div>

        {/* System Telemetry & User Card */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a472] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a472]"></span>
            </span>
            <span className="text-[11px] text-[#00a472] font-semibold">Copilot Agent: Active & Safe</span>
          </div>

          <div className="relative">
            <button
              className="h-8 w-8 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#45474c] transition-colors"
              title="Operational Risk Alerts"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] flex items-center justify-center font-bold">
              4
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex h-8 items-center gap-2 rounded-xl px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>

          <div className="flex items-center gap-2 pl-1.5 py-1 pr-3 rounded-xl bg-[#eff4ff]">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs">
              {initials || 'U'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-[#0b1c30] leading-tight">{displayName}</span>
              <span className="text-[10px] text-[#45474c]">{displayRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}