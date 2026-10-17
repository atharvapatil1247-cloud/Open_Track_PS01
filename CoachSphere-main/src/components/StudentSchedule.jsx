import React from 'react';
import {
  Clock,
  Calendar,
  Building2,
  Video,
  Laptop,
  Users,
  ExternalLink,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function StudentSchedule({ onShowToast = () => {} }) {
  const weeklyTimetable = [
    {
      day: 'Today (Friday)',
      time: '09:00 - 11:30 AM',
      batch: 'Java Full Stack (JFS-04)',
      topic: 'Sprint 3: Microservice Containerization & Redis Blacklist',
      faculty: 'Prof. Rajiv Kumar',
      location: 'Lab 03 Core',
      assignedTerminal: 'Seat PC-02',
      zoomLink: 'https://zoom.us/j/9842103445',
      status: 'active'
    },
    {
      day: 'Today (Friday)',
      time: '02:00 - 04:30 PM',
      batch: 'Lab Practice & Code Reviews',
      topic: 'Hands-on Docker Container Networking & MongoDB Setup',
      faculty: 'Lab Assistants Desk',
      location: 'Lab 01 Cluster',
      assignedTerminal: 'Seat PC-14',
      zoomLink: 'https://zoom.us/j/9842103446',
      status: 'upcoming'
    },
    {
      day: 'Monday',
      time: '09:00 - 11:30 AM',
      batch: 'Java Full Stack (JFS-04)',
      topic: 'Sprint 4: Kafka Event Streams & Message Queues',
      faculty: 'Prof. Rajiv Kumar',
      location: 'Lab 03 Core',
      assignedTerminal: 'Seat PC-02',
      zoomLink: 'https://zoom.us/j/9842103445',
      status: 'upcoming'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Personalized Schedule & Room Allocations</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Synchronized with Campus Solver
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned Lab: <strong className="text-slate-800">Lab 03 Core (Seat PC-02)</strong> • Subnet: 192.168.3.102
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Exported timetable to iCal / Google Calendar.')}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sync to Calendar</span>
        </button>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Upcoming Class & Lab Slots</h3>

        <div className="space-y-3">
          {weeklyTimetable.map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                slot.status === 'active'
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{slot.batch}</span>
                      {slot.status === 'active' && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md">
                          Live In Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{slot.topic}</p>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-700">{slot.day} • {slot.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {slot.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" /> {slot.assignedTerminal}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => onShowToast(`Navigating to ${slot.zoomLink}`)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Join Stream</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}