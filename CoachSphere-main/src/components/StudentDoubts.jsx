import React, { useState } from 'react';
import {
  HelpCircle,
  Calendar,
  Clock,
  User,
  Send,
  CheckCircle2,
  Code2,
  FileCode
} from 'lucide-react';

export default function StudentDoubts({ onShowToast = () => {} }) {
  const [topic, setTopic] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  const [activeRequests, setActiveRequests] = useState([
    {
      id: 'DBT-401',
      mentor: 'Prof. Rajiv Kumar (Lead Java Faculty)',
      topic: 'Spring Security FilterChain JWT issue',
      time: 'Today 4:30 PM (15 Mins)',
      location: 'Conference Bay B (Desk 02)',
      status: 'confirmed'
    }
  ]);

  const availableSlots = [
    'Today 5:00 PM (15 Mins)',
    'Tomorrow 11:30 AM (15 Mins)',
    'Tomorrow 4:30 PM (15 Mins)'
  ];

  const handleBookSlot = (e) => {
    e.preventDefault();
    if (!topic || !selectedSlot) {
      onShowToast('Please provide a topic and select an open mentor slot.');
      return;
    }

    const newRequest = {
      id: `DBT-${Math.floor(400 + Math.random() * 90)}`,
      mentor: 'Prof. Rajiv Kumar',
      topic,
      time: selectedSlot,
      location: 'Conference Bay B (Desk 02)',
      status: 'pending'
    };

    setActiveRequests([newRequest, ...activeRequests]);
    setTopic('');
    setSelectedSlot('');
    setCodeSnippet('');
    onShowToast('Doubt slot request submitted to faculty desk.');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">1:1 Faculty Intervention & Doubt Desk</h2>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                SLA: Guaranteed Same-Day Slot
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Book dedicated 15-minute 1:1 sessions with faculty to review code bugs, architecture, or Git blocks.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Booking Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Reserve 1:1 Doubt Session</h3>
            <p className="text-xs text-slate-500">Pick an open faculty mentor window</p>
          </div>

          <form onSubmit={handleBookSlot} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Doubt Topic / Problem Summary
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Redis blacklisted token expiration not triggering"
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Available Faculty Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose an open mentor window --</option>
                {availableSlots.map((slot, i) => (
                  <option key={i} value={slot}>
                    {slot} • Prof. Rajiv Kumar
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Code Snippet / Exception Stacktrace (Optional)
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste failing test assertion or error log here..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Slot Reservation</span>
            </button>
          </form>
        </div>

        {/* Right: Active Booked Sessions */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Your Reserved Doubt Slots</h3>
            <p className="text-xs text-slate-500">Upcoming calendar commitments</p>
          </div>

          <div className="space-y-3">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{req.mentor}</span>
                  <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {req.time}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">Topic: "{req.topic}"</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Location: {req.location}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}