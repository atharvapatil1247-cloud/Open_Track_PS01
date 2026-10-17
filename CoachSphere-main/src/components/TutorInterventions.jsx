import React, { useState } from 'react';
import {
  HelpCircle,
  Code2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Check,
  Sparkles
} from 'lucide-react';

export default function TutorInterventions({ onShowToast = () => {} }) {
  const [doubtQueue, setDoubtQueue] = useState([
    {
      id: 'DBT-401',
      studentName: 'Rahul Verma',
      topic: 'Spring Security FilterChain JWT issue',
      timeRequested: 'Today 4:30 PM (15 Mins)',
      status: 'pending',
      codeSnippet: 'SecurityFilterChain filterChain(HttpSecurity http) throws Exception'
    },
    {
      id: 'DBT-402',
      studentName: 'Arjun Nair',
      topic: 'Docker container network port binding',
      timeRequested: 'Tomorrow 11:00 AM (10 Mins)',
      status: 'pending',
      codeSnippet: 'docker run -p 27017:27017 --name mongo-db'
    }
  ]);

  const [pullRequests, setPullRequests] = useState([
    {
      id: 'PR-12',
      studentName: 'Sneha Kulkarni',
      repo: 'tst-cohort-jfs/microservices-auth',
      branch: 'feature/redis-token-blacklist',
      reviewed: false
    },
    {
      id: 'PR-14',
      studentName: 'Tanvi Patel',
      repo: 'tst-cohort-jfs/microservices-auth',
      branch: 'fix/kafka-event-serializer',
      reviewed: true
    }
  ]);

  const handleAcceptDoubt = (id, name) => {
    setDoubtQueue((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'confirmed' } : d))
    );
    onShowToast(`1:1 Doubt slot confirmed with ${name}. Calendar invite dispatched.`);
  };

  const handleApprovePR = (id, name) => {
    setPullRequests((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, reviewed: true } : pr))
    );
    onShowToast(`Approved GitHub PR ${id} for ${name}.`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Student Interventions & PR Reviews</h2>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                SLA: Same-Day Turnaround
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review stuck learner code and schedule 1:1 doubt-clearing recovery slots.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid: Doubts Queue (Left) & PR Reviews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 1:1 Doubt Clearing Slots */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">1:1 Faculty Intervention Requests</h3>
            <p className="text-xs text-slate-500">Students flagged as behind in lab submissions</p>
          </div>

          <div className="space-y-3">
            {doubtQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.studentName}</span>
                  <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                    {item.timeRequested}
                  </span>
                </div>

                <p className="text-slate-600 font-medium">Topic: "{item.topic}"</p>

                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto">
                  <code>{item.codeSnippet}</code>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Desk: Conference Bay B</span>
                  <button
                    disabled={item.status === 'confirmed'}
                    onClick={() => handleAcceptDoubt(item.id, item.studentName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      item.status === 'confirmed'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.status === 'confirmed' ? 'Slot Confirmed' : 'Confirm Slot'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: GitHub PR Submissions */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">GitHub Pull Requests</h3>
            <p className="text-xs text-slate-500">Review lab merge requests</p>
          </div>

          <div className="space-y-3">
            {pullRequests.map((pr) => (
              <div
                key={pr.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{pr.studentName}</span>
                  <span className="font-mono text-[10px] text-slate-500">{pr.id}</span>
                </div>

                <div className="text-[11px] text-slate-600 font-mono truncate">
                  {pr.repo}
                </div>

                <div className="text-[11px] text-indigo-600 font-mono bg-white p-1 rounded border border-slate-200 truncate">
                  {pr.branch}
                </div>

                <div className="pt-1 flex justify-end">
                  {pr.reviewed ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Code Merged
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprovePR(pr.id, pr.studentName)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Approve & Merge PR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}