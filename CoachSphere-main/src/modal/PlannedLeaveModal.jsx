import React, { useState, useEffect } from 'react';
import {
  Calendar,
  X,
  Send,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Clock,
  FileText,
  UserCheck,
  TrendingDown
} from 'lucide-react';

export default function PlannedLeaveModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [leaveType, setLeaveType] = useState('interview'); // 'interview' | 'medical' | 'hackathon' | 'personal'
  const [startDate, setStartDate] = useState('2026-10-20');
  const [endDate, setEndDate] = useState('2026-10-21');
  const [leaveDuration, setLeaveDuration] = useState('2'); // Days
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student baseline metrics
  const currentAttendance = 98.4;
  const totalClasses = 33;
  const attendedClasses = 32;

  // Projected attendance math
  const daysOff = parseInt(leaveDuration, 10) || 1;
  const projectedAttendance = (
    (attendedClasses / (totalClasses + daysOff)) *
    100
  ).toFixed(1);
  const isSafeGate = parseFloat(projectedAttendance) >= 80.0;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      onShowToast('Please provide a brief justification for the planned leave.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(
        `Leave application #LEV-1094 dispatched to Academic Coordinator & Prof. Rajiv Kumar.`
      );
      onClose();
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 2. Modal Window */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Apply for Planned Leave</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit an authorized absence request to prevent unexcused penalty flags
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          
          {/* Attendance Impact Simulator Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                Graduation Gate Impact Forecaster
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isSafeGate
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isSafeGate ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Gate Safe (&ge;80%)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                    <span>Risk Alert (&lt;80%)</span>
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Current Velocity</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {currentAttendance}%
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold mt-0.5">
                  Gate Qualified
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Projected After Leave</span>
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`text-base font-bold font-mono ${
                      isSafeGate ? 'text-indigo-600' : 'text-rose-600'
                    }`}
                  >
                    {projectedAttendance}%
                  </span>
                  <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  -{ (currentAttendance - parseFloat(projectedAttendance)).toFixed(1) }% deduction
                </span>
              </div>
            </div>
          </div>

          {/* Leave Category Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Absence Category</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'interview', label: 'Tech Interview / Placement' },
                { id: 'medical', label: 'Medical / Health Emergency' },
                { id: 'hackathon', label: 'External Hackathon / Project' },
                { id: 'personal', label: 'Planned Personal / Family Leave' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setLeaveType(cat.id)}
                  className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                    leaveType === cat.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Leave Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Leave End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Total Missed Lab Sessions</label>
            <select
              value={leaveDuration}
              onChange={(e) => setLeaveDuration(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="1">1 Day (1 Morning Core Lab Session)</option>
              <option value="2">2 Days (2 Core Lab Sessions)</option>
              <option value="3">3 Days (Sprint Milestone Catch-up Required)</option>
              <option value="4">4+ Days (Requires Coordinator Personal Review)</option>
            </select>
          </div>

          {/* Justification Textarea */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Reason / Supporting Details
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Attending Google Summer of Code regional finals / Medical appointment..."
              rows={3}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Automatic Exemption Policy Note */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Approved leaves pause the <strong>Unexcused Absence Streak Counter</strong> and exempt you from automated retention radar alerts.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Request</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}