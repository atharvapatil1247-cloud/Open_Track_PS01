import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Users,
  Video,
  CheckCircle2,
  AlertTriangle,
  Laptop
} from 'lucide-react';

import EquipmentSwapModal from '../modal/EquipmentSwapModal';

export default function TutorSchedule({ onShowToast = () => {} }) {
  const [labSlots] = useState([
    {
      id: 'slot-1',
      batch: 'Java Full Stack (JFS-04)',
      time: '09:00 - 11:30 AM',
      room: 'Lab 03 Core',
      capacity: '34 / 34 Seats',
      hardware: 'High-Spec Core i7 Workstations',
      isCurrent: true
    },
    {
      id: 'slot-2',
      batch: 'Spring Boot Microservices',
      time: '02:00 - 04:30 PM',
      room: 'Lab 01 Cluster',
      capacity: '28 / 30 Seats',
      hardware: 'Docker Swarm Dedicated Hub',
      isCurrent: false
    },
    {
      id: 'slot-3',
      batch: 'Faculty Office Hours / Doubt Clearing',
      time: '05:00 - 06:00 PM',
      room: 'Conference Bay B',
      capacity: '1:1 Doubt Desks',
      hardware: 'Dual Monitor Support',
      isCurrent: false
    }
  ]);

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Lab & Workstation Allocation</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                0 Clashes Detected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized trainer schedule synchronized with the 1.4s campus constraint solver.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSwapModalOpen(true)}          
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
        >
          Request Equipment Swap
        </button>
      </section>

      {/* 2. Today's Lab Schedule Cards */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Scheduled Lab Slots for Today</h3>

        <div className="space-y-3">
          {labSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                slot.isCurrent
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{slot.batch}</span>
                      {slot.isCurrent && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md">
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-700">{slot.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {slot.room}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {slot.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
                    {slot.hardware}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Equipment Swap Modal Dialog */}
<EquipmentSwapModal
  isOpen={isSwapModalOpen}
  onClose={() => setIsSwapModalOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}