import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Award,
  GitBranch,
  Calendar,
  ExternalLink,
  Flame,
  Radio,
  FileText
} from 'lucide-react';

import PlannedLeaveModal from '../modal/PlannedLeaveModal';

export default function StudentAcademicHub({ onShowToast = () => {} }) {

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const currentModules = [
    { name: 'Module 1: Core Java & OOP Concepts', status: 'completed', score: '94%' },
    { name: 'Module 2: Relational Databases & Hibernate ORM', status: 'completed', score: '91%' },
    { name: 'Module 3: Spring Framework & Spring Boot', status: 'completed', score: '88%' },
    { name: 'Module 4: RESTful Microservices & Docker', status: 'active', score: 'In Progress' },
    { name: 'Module 5: Kafka Event Streaming & Redis Blacklist', status: 'upcoming', score: '--' },
    { name: 'Module 6: Cloud Native Deployment & Capstone', status: 'upcoming', score: '--' }
  ];
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Learner Academic Hub</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                14-Day Attendance Streak
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Learner: <strong className="text-slate-800">Tanvi Patel</strong> (Roll No: 2026-JFS-014) • Cohort: Java Full Stack (JFS-04)
            </p>
          </div>
        </div>

        <button
          type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors self-start md:self-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Apply For Planned Leave</span>
        </button>
      </section>

      {/* 2. Key Academic KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Attendance Velocity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600">98.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">&gt; 80% Gate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">32 of 33 lab sessions validated</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Graduation Eligibility</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">3 of 3 Gates</span>
            <span className="text-xs text-indigo-600 font-semibold">Green</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Attendance, Lab PRs, Zero Dues</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Lab Sprint Evaluation</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">92.0%</span>
            <span className="text-xs text-emerald-600 font-semibold">Top 5%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">4 of 4 sprints approved by faculty</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Syllabus Progress</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-indigo-600">67%</span>
            <span className="text-xs text-slate-500 font-medium">Sprint 3 Active</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full w-[67%]" />
          </div>
        </div>
      </section>

      {/* 3. Active Sprint & GitHub Milestone Card */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Current Milestone: Sprint 3 JWT FilterChain</h3>
            <p className="text-xs text-slate-500">Assigned Mentor: Prof. Rajiv Kumar • Target Submission: Friday 6:00 PM</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" />
            Branch: feature/jwt-filter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">Assigned Lab Workstation</span>
              <p className="text-xs text-slate-500">Physical terminal configured in Lab 03 Core</p>
              <div className="mt-2 text-xs font-mono font-bold text-slate-800 bg-white p-2 rounded border border-slate-200">
                Seat PC-02 • 192.168.3.102
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Terminal PC-02 credentials copied to clipboard.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Copy SSH Config</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">GitHub PR Status</span>
              <p className="text-xs text-slate-500">Commit 4a9f1b2 verified by GitHub Actions CI pipeline</p>
              <div className="mt-2 text-xs font-mono text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>All 4 Test Suites Passing</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Opening student pull request #PR-14 on GitHub.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>View Pull Request #14</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">Live Ingress Authentication</span>
              <p className="text-xs text-slate-500">Today's door badge scan verified at 08:58:14 AM</p>
              <div className="mt-2 text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                RFID Kiosk Door A • Biometric Hash OK
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Attendance history log exported.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Download Ingress Proof</span>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Complete Module Roadmap */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Curriculum Progression Roadmap</h3>
        <div className="space-y-2.5">
          {currentModules.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-800">{m.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-700">{m.score}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    m.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : m.status === 'active'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Planned Leave Request Modal */}
<PlannedLeaveModal
  isOpen={isLeaveModalOpen}
  onClose={() => setIsLeaveModalOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}