import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Fingerprint,
  Video,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Search,
  Check,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Users,
  Download,
  Clock,
  Radio,
  Wifi,
  Laptop,
  Filter,
  Eye,
  Terminal,
  Activity,
  FileSpreadsheet
} from 'lucide-react';

export default function TutorAttendance({ onShowToast = () => {} }) {
  const [attendanceLocked, setAttendanceLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'present' | 'absent' | 'anomaly'
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(30);
  const [qrToken, setQrToken] = useState('AUTH-QR-JFS04-9842');

  // Interactive Live Attendance Roster with Detailed Telemetry
  const [roster, setRoster] = useState([
    {
      id: 'PC-02',
      studentName: 'Tanvi Patel',
      rollNo: '2026-JFS-014',
      status: 'present',
      source: 'RFID Kiosk (Door A)',
      timestamp: '08:58:14 AM',
      ipAddress: '192.168.3.102',
      historicRate: 98.4,
      streak: '14 days clean',
      note: 'Verified biometric fingerprint match'
    },
    {
      id: 'PC-09',
      studentName: 'Sneha Kulkarni',
      rollNo: '2026-JFS-022',
      status: 'present',
      source: 'RFID Kiosk (Door A)',
      timestamp: '09:01:28 AM',
      ipAddress: '192.168.3.109',
      historicRate: 88.0,
      streak: '4 days clean',
      note: 'Sprint 2 lab completed on schedule'
    },
    {
      id: 'PC-14',
      studentName: 'Rahul Verma',
      rollNo: '2026-JFS-035',
      status: 'absent',
      source: 'No check-in recorded',
      timestamp: '--:--:--',
      ipAddress: 'Unallocated',
      historicRate: 64.2,
      streak: '4 consecutive missed',
      note: 'Flagged on Retention Risk Radar'
    },
    {
      id: 'PC-22',
      studentName: 'Arjun Nair',
      rollNo: '2026-JFS-008',
      status: 'present',
      source: 'Dual Zoom Stream',
      timestamp: '09:04:12 AM',
      ipAddress: '49.36.120.44 (Remote)',
      historicRate: 92.5,
      streak: '98 mins connected',
      note: 'Microphone & Screen pipe verified'
    },
    {
      id: 'PC-28',
      studentName: 'Aditya Joshi',
      rollNo: '2026-JFS-041',
      status: 'anomaly',
      source: 'Kiosk Scan + Foreign IP',
      timestamp: '09:02:40 AM',
      ipAddress: '103.21.144.12 (Cellular Proxy)',
      historicRate: 82.1,
      streak: 'IP Mismatch',
      note: 'RFID door pass swiped, but code pushed from external ISP'
    },
    {
      id: 'PC-31',
      studentName: 'Pooja Deshmukh',
      rollNo: '2026-JFS-019',
      status: 'present',
      source: 'Dynamic TOTP QR',
      timestamp: '09:03:05 AM',
      ipAddress: '192.168.3.131',
      historicRate: 94.0,
      streak: '8 days clean',
      note: 'Scanned screen QR via student mobile app'
    }
  ]);

  // Live Ingress Audit Log Stream
  const [ingressLogs, setIngressLogs] = useState([
    {
      id: 'ING-9021',
      time: '09:04:12 AM',
      event: 'Zoom Bridge Auth',
      details: 'Arjun Nair joined cluster node 02. Ping: 24ms, packet loss: 0.1%.',
      level: 'success'
    },
    {
      id: 'ING-9020',
      time: '09:03:05 AM',
      event: 'Dynamic QR Scan',
      details: 'Pooja Deshmukh validated against token AUTH-QR-JFS04-9842.',
      level: 'success'
    },
    {
      id: 'ING-9019',
      time: '09:02:40 AM',
      event: 'Security Anomaly',
      details: 'Aditya Joshi IP divergence flagged. Kiosk door RFID does not match socket IP.',
      level: 'warning'
    },
    {
      id: 'ING-9018',
      time: '09:01:28 AM',
      event: 'Physical Door Kiosk',
      details: 'Sneha Kulkarni swiped badge #RFID-8812 at Lab 03 entrance turnstile.',
      level: 'info'
    },
    {
      id: 'ING-9017',
      time: '08:58:14 AM',
      event: 'Biometric Scanner',
      details: 'Tanvi Patel matched optical fingerprint hash on Terminal Kiosk 01.',
      level: 'info'
    }
  ]);

  // Dynamic QR Code Countdown Timer
  useEffect(() => {
    if (!showQrModal) return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setQrToken(`AUTH-QR-JFS04-${Math.floor(1000 + Math.random() * 9000)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showQrModal]);

  // Toggle student status manually
  const toggleStudentStatus = (index) => {
    if (attendanceLocked) return;
    setRoster((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const nextStatus =
            item.status === 'present'
              ? 'absent'
              : item.status === 'absent'
              ? 'anomaly'
              : 'present';
          return {
            ...item,
            status: nextStatus,
            source: nextStatus === 'present' ? 'Manual Instructor Override' : item.source
          };
        }
        return item;
      })
    );
  };

  const handleMarkAllPresent = () => {
    if (attendanceLocked) return;
    setRoster((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'present',
        source: item.status === 'absent' ? 'Batch Faculty Override' : item.source
      }))
    );
    onShowToast('Marked all unassigned seats as Present.');
  };

  const handleResolveAnomaly = (studentId) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.id === studentId
          ? { ...item, status: 'present', note: 'IP divergence manually cleared by faculty' }
          : item
      )
    );
    onShowToast(`Cleared proxy anomaly for ${studentId}.`);
  };

  const handleLockAttendance = () => {
    setAttendanceLocked(true);
    onShowToast('Session attendance roster cryptographically locked and committed to SHA-256 audit log.');
  };

  // Filter calculations
  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const anomalyCount = roster.filter((r) => r.status === 'anomaly').length;
  const attendanceRate = ((presentCount / roster.length) * 100).toFixed(1);

  const filteredRoster = roster.filter((st) => {
    const matchesFilter = statusFilter === 'all' || st.status === statusFilter;
    const matchesSearch =
      st.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      {/* 1. Header with Controls */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Classroom Attendance Verification</h2>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-indigo-500 animate-pulse" />
                Live Door Kiosk Stream
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cohort: <strong className="text-slate-800">Java Full Stack (JFS-04)</strong> • Room: Lab 03 Core • Session: 09:00 - 11:30 AM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* Dynamic QR Kiosk Button */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Launch Dynamic QR Kiosk</span>
          </button>

          {/* Lock & Submit Button */}
          <button
            type="button"
            onClick={handleLockAttendance}
            disabled={attendanceLocked}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors ${
              attendanceLocked
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{attendanceLocked ? 'Roster Sealed & Committed' : 'Lock & Submit Roster'}</span>
          </button>
        </div>
      </section>

      {/* 2. Telemetry Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Attendance Rate</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">{presentCount} in Seats</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unaccounted Absentees</span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-600">{absentCount} Absent</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded">
              Retention Alert
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">1 student on 4th consecutive day</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Proxy & IP Divergence</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600">{anomalyCount} Flagged</span>
            <span className="text-xs text-slate-500">Needs Review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Turnstile pass with cellular IP</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ingress Sources</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Fingerprint className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">4 RFID / 1 Zoom</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">1 Dynamic QR handshake validated</p>
        </div>
      </section>

      {/* 3. Interactive Roster Table */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Terminal Ingress Verification Table</h3>
              <span className="text-xs text-slate-400">({filteredRoster.length} candidates)</span>
            </div>
            <p className="text-xs text-slate-500">Click any student status badge to toggle between Present, Absent, and Anomaly.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Search */}
            <div className="relative flex items-center w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, terminal, IP..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Bulk Action */}
            <button
              type="button"
              disabled={attendanceLocked}
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Mark All Present
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Filter View:</span>
          {[
            { id: 'all', label: `All (${roster.length})` },
            { id: 'present', label: `Present (${presentCount})` },
            { id: 'absent', label: `Absent (${absentCount})` },
            { id: 'anomaly', label: `Anomalies (${anomalyCount})` }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === f.id ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3 rounded-l-lg">Terminal / Seat</th>
                <th className="py-2.5 px-3">Student Name & Roll No</th>
                <th className="py-2.5 px-3">Ingress Source & Time</th>
                <th className="py-2.5 px-3">Network IP Address</th>
                <th className="py-2.5 px-3">Attendance History</th>
                <th className="py-2.5 px-3">Status (Click to Toggle)</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Instructor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.map((st, idx) => {
                const isPresent = st.status === 'present';
                const isAbsent = st.status === 'absent';
                const isAnomaly = st.status === 'anomaly';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Terminal */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {st.id}
                      </span>
                    </td>

                    {/* Student Name & Roll No */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-slate-900 block">{st.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.rollNo}</span>
                      </div>
                    </td>

                    {/* Ingress Source & Time */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-semibold text-slate-700 block">{st.source}</span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {st.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Network IP */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-600 block">{st.ipAddress}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{st.note}</span>
                    </td>

                    {/* Historic Attendance */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold font-mono text-xs ${
                            st.historicRate >= 85 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {st.historicRate}%
                        </span>
                        <span className="text-[10px] text-slate-400">({st.streak})</span>
                      </div>
                    </td>

                    {/* Status Badge Toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        disabled={attendanceLocked}
                        onClick={() => toggleStudentStatus(idx)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-transform active:scale-95 ${
                          isPresent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : isAbsent
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to cycle status"
                      >
                        {isPresent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isAbsent && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {isAnomaly && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        <span className="capitalize">{st.status}</span>
                      </button>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 text-right">
                      {isAnomaly ? (
                        <button
                          type="button"
                          onClick={() => handleResolveAnomaly(st.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Clear IP Flag</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Action Req</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Live Ingress Event Stream Console */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Door Turnstile & Biometric Sensor Event Audit</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
              Subnet 192.168.3.0/24
            </span>
          </div>
          <button
            type="button"
            onClick={() => onShowToast('Exported Session Ingress Audit to CSV.')}
            className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export Log</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#091426] text-white p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>EVENT HASH / TIME</span>
            <span>INGRESS PROTOCOL SENSOR READOUT</span>
          </div>

          <div className="space-y-2 pt-1">
            {ingressLogs.map((log) => {
              const isSuccess = log.level === 'success';
              const isWarning = log.level === 'warning';

              return (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 transition-colors border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        isWarning ? 'bg-amber-400 animate-pulse' : isSuccess ? 'bg-emerald-400' : 'bg-indigo-400'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-bold">{log.time}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                          {log.id}
                        </span>
                        <span className="text-[11px] text-indigo-300 font-semibold">{log.event}</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Dynamic TOTP QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Dynamic In-Room Kiosk</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Students scan this QR using the mobile app to verify physical presence in Lab 03.
            </p>

            {/* Stylized QR Box */}
            <div className="w-48 h-48 bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white relative shadow-lg">
              <QrCode className="w-32 h-32 text-white" />
              <div className="absolute inset-x-2 bottom-2 text-center text-[10px] font-mono text-emerald-400 bg-slate-800/90 py-0.5 rounded">
                {qrToken}
              </div>
            </div>

            {/* Dynamic Countdown */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>
                Token refreshes in: <strong className="text-indigo-600 font-mono">{qrCountdown}s</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowQrModal(false);
                onShowToast('Closed dynamic QR kiosk mode.');
              }}
              className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Done & Close Kiosk
            </button>
          </div>
        </div>
      )}

    </div>
  );
}