import React, { useState } from 'react';
import {
  Users,
  Fingerprint,
  Video,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Filter,
  Search,
  RefreshCw,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowUpRight,
  Eye,
  Check
} from 'lucide-react';

import ExportAuditLogsModal from '../modal/ExportAuditLogsModal';

export default function Attendance({ onShowToast = () => {} }) {
  const [selectedBatch, setSelectedBatch] = useState('JFS-04');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'present' | 'absent' | 'anomaly'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Student Attendance Records for selected batch
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 'STU-101',
      name: 'Rahul Verma',
      seat: 'Lab 03 • PC-14',
      physicalKiosk: 'Not Scanned',
      webinarLog: 'Disconnected (18 mins)',
      status: 'absent', // 'present' | 'absent' | 'anomaly'
      riskScore: 94,
      anomalyReason: 'Consecutive Day 4 Absence across both streams'
    },
    {
      id: 'STU-102',
      name: 'Sneha Kulkarni',
      seat: 'Lab 03 • PC-09',
      physicalKiosk: 'RFID In: 08:56 AM',
      webinarLog: 'Sync Pass (142 mins)',
      status: 'present',
      riskScore: 18,
      anomalyReason: null
    },
    {
      id: 'STU-103',
      name: 'Arjun Nair',
      seat: 'Remote • Seat R-04',
      physicalKiosk: 'Remote Exemption',
      webinarLog: 'Left Early (42 / 120 mins)',
      status: 'anomaly',
      riskScore: 71,
      anomalyReason: 'Under min threshold: Left session before mandatory lab completion'
    },
    {
      id: 'STU-104',
      name: 'Tanvi Patel',
      seat: 'Lab 03 • PC-02',
      physicalKiosk: 'RFID In: 09:02 AM',
      webinarLog: 'Sync Pass (138 mins)',
      status: 'present',
      riskScore: 12,
      anomalyReason: null
    },
    {
      id: 'STU-105',
      name: 'Aditya Joshi',
      seat: 'Lab 03 • PC-28',
      physicalKiosk: 'RFID In: 09:14 AM',
      webinarLog: 'IP Mismatch Warning',
      status: 'anomaly',
      riskScore: 64,
      anomalyReason: 'Simultaneous login: Kiosk badge scanned in Pune, Zoom IP logged from Bengaluru'
    }
  ]);

  const handleRefreshSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Dual-stream telemetry re-synchronized with Zoom Webhooks & RFID Kiosk.');
    }, 900);
  };

  const filteredStudents = attendanceRecords.filter((record) => {
    const matchesStatus =
      filterStatus === 'all' || record.status === filterStatus;
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.seat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Ingress Telemetry Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Dual-Stream Hybrid Attendance Vault</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Ingress: 99.8% Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlating biometric kiosk RFID scans with Zoom WebRTC attendee pings in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefreshSync}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Webhooks</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}            
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </section>

      {/* 2. Telemetry Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Aggregate Present</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">382 / 412</span>
            <span className="text-xs text-emerald-600 font-semibold">92.7%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across 18 concurrent batches</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Physical Kiosk Scans</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">264</span>
            <span className="text-xs text-slate-500">In-Person Labs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">RFID hardware response: 12ms</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Remote Zoom Attendees</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">118</span>
            <span className="text-xs text-slate-500">Hybrid Streams</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Minimum 75m threshold applied</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Flagged Anomalies</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600">8 Flagged</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
              Needs Review
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Early exits & proxy IP clashes</p>
        </div>
      </section>

      {/* 3. Batch Selector Strip & Filters */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Batch Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'JFS-04', label: 'Java Full Stack (JFS-04)', count: '34 Students' },
              { id: 'DO-08', label: 'DevOps & Cloud (DO-08)', count: '28 Students' },
              { id: 'RF-14', label: 'React Frontend (RF-14)', count: '32 Students' },
              { id: 'DS-02', label: 'Data Science (DS-02)', count: '25 Students' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBatch(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBatch === b.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{b.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, PC ID..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Records' },
              { id: 'present', label: 'Present' },
              { id: 'absent', label: 'Absent' },
              { id: 'anomaly', label: 'Anomalies / Early Exit' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Showing {filteredStudents.length} of {attendanceRecords.length} records
          </span>
        </div>

        {/* 4. Student Attendance Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3 rounded-l-lg">Student Profile</th>
                <th className="py-2.5 px-3">Seat / Lab Allocation</th>
                <th className="py-2.5 px-3">Physical Kiosk Log</th>
                <th className="py-2.5 px-3">Zoom WebRTC Ping</th>
                <th className="py-2.5 px-3">Verified Status</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Audit Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isAbsent = student.status === 'absent';
                const isAnomaly = student.status === 'anomaly';
                const isPresent = student.status === 'present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{student.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{student.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Seat Allocation */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 block">{student.seat}</span>
                      <span className="text-[10px] text-slate-400">Batch {selectedBatch}</span>
                    </td>

                    {/* Physical Kiosk */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Fingerprint className={`w-3.5 h-3.5 ${
                          student.physicalKiosk.includes('RFID In')
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`} />
                        <span className="text-slate-600">{student.physicalKiosk}</span>
                      </div>
                    </td>

                    {/* Zoom Webhook */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Video className={`w-3.5 h-3.5 ${
                          student.webinarLog.includes('Pass')
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`} />
                        <span className="text-slate-600">{student.webinarLog}</span>
                      </div>
                    </td>

                    {/* Verified Status Badge */}
                    <td className="py-3 px-3">
                      {isPresent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                        </span>
                      )}
                      {isAbsent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 text-rose-600" /> Absent
                        </span>
                      )}
                      {isAnomaly && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Early Exit / Proxy
                        </span>
                      )}
                    </td>

                    {/* Audit Flag / Reason */}
                    <td className="py-3 px-3 text-right">
                      {student.anomalyReason ? (
                        <span className="text-[11px] font-medium text-amber-700 block max-w-xs ml-auto">
                          {student.anomalyReason}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Verified Safe</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <ExportAuditLogsModal
  isOpen={isAuditModalOpen}
  onClose={() => setIsAuditModalOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}