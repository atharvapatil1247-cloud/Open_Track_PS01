import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  X,
  Laptop,
  Cpu,
  Building2,
  Clock,
  ShieldCheck,
  Check,
  AlertTriangle,
  Monitor,
  HardDrive,
  Send,
  SlidersHorizontal
} from 'lucide-react';

export default function EquipmentSwapModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [selectedSlot, setSelectedSlot] = useState('slot-1');
  const [swapReason, setSwapReason] = useState('oom_crash'); // 'oom_crash' | 'monitor_defect' | 'docker_daemon' | 'gpu_requirement'
  const [targetEquipment, setTargetEquipment] = useState('high_spec_i7');
  const [affectedTerminals, setAffectedTerminals] = useState('PC-22');
  const [urgency, setUrgency] = useState('immediate'); // 'immediate' | 'next_session' | 'routine'
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const labSlots = [
    {
      id: 'slot-1',
      batch: 'Java Full Stack (JFS-04)',
      time: '09:00 - 11:30 AM',
      room: 'Lab 03 Core',
      currentHardware: '34x Core i7 Workstations (16GB RAM)'
    },
    {
      id: 'slot-2',
      batch: 'Spring Boot Microservices',
      time: '02:00 - 04:30 PM',
      room: 'Lab 01 Cluster',
      currentHardware: '30x Docker Swarm Dedicated Hub'
    },
    {
      id: 'slot-3',
      batch: 'Faculty Office Hours / Doubt Desk',
      time: '05:00 - 06:00 PM',
      room: 'Conference Bay B',
      currentHardware: 'Dual Monitor Review Terminal'
    }
  ];

  const equipmentOptions = [
    {
      id: 'high_spec_i7',
      title: 'High-Spec Core i7 Workstation',
      specs: '32GB DDR5 RAM, 1TB NVMe, Ubuntu 24.04 LTS',
      available: '3 Units Ready in Tech Bay',
      icon: Laptop
    },
    {
      id: 'docker_cluster_node',
      title: 'Dedicated Docker Swarm Node',
      specs: 'Pre-configured daemon socket, 8-Core Xeon, Bridge eth0',
      available: '2 Cluster Nodes Available',
      icon: Cpu
    },
    {
      id: 'dual_monitor_rig',
      title: 'Dual 27" 4K Review Rig',
      specs: 'Color-calibrated IPS displays + USB-C Hub',
      available: '4 Sets Available',
      icon: Monitor
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(
        `Equipment swap ticket #REQ-8821 dispatched to Lab Admin. Standby terminal allocated.`
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
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Request Equipment Swap</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reallocate faulty terminals or upgrade hardware specs for active lab sessions
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
          
          {/* Target Session Slot */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Affected Lab Session Slot</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            >
              {labSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.room} • {slot.batch} ({slot.time})
                </option>
              ))}
            </select>
          </div>

          {/* Terminal ID & Reason Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Faulty Terminal / Workstation</label>
              <input
                type="text"
                value={affectedTerminals}
                onChange={(e) => setAffectedTerminals(e.target.value)}
                placeholder="e.g. PC-22 or All Room Seats"
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Swap Reason</label>
              <select
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="oom_crash">Container OOM / RAM Exhaustion</option>
                <option value="docker_daemon">Docker Daemon Socket Failure</option>
                <option value="monitor_defect">Display / Screen Artifacts</option>
                <option value="gpu_requirement">Module Requires CUDA / GPU</option>
                <option value="peripheral">Keyboard / Mouse / Subnet IO</option>
              </select>
            </div>
          </div>

          {/* Replacement Hardware Target Cards */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">Requested Replacement Hardware</label>
            <div className="space-y-2">
              {equipmentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = targetEquipment === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setTargetEquipment(opt.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {opt.available}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.specs}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Dispatch Urgency</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'immediate', label: 'In-Session Emergency', sub: 'Tech Assistant in 5m' },
                { id: 'next_session', label: 'Before Next Slot', sub: 'Before 02:00 PM' },
                { id: 'routine', label: 'End of Day', sub: 'Overnight Service' }
              ].map((u) => {
                const isSelected = urgency === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs">{u.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{u.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Solver Availability Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Campus Constraint Solver: 0 resource clashes detected with adjacent lab sessions.</span>
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
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Equipment Requisition</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}