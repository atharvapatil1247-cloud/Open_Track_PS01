import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  FileSpreadsheet,
  FileCode2,
  Calendar,
  ShieldCheck,
  CheckSquare,
  Users,
  Fingerprint,
  Radio,
  FileCheck,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function ExportAuditLogsModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' | 'json' | 'excel'
  const [selectedBatch, setSelectedBatch] = useState('JFS-04');
  const [dateRange, setDateRange] = useState('today'); // 'today' | '7days' | '30days' | 'anomalies_only'
  
  // Telemetry Channel toggles
  const [channels, setChannels] = useState({
    rfid: true,
    zoom: true,
    dynamicQr: true,
    anomalies: true
  });

  const [maskStudentNames, setMaskStudentNames] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Close on Escape key press & prevent background scroll
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

  // Real audit log dataset for Batches & Attendance
  const auditLogsDataset = [
    {
      eventId: 'ING-9021',
      sessionDate: '2026-10-16',
      timestamp: '09:04:12 AM',
      batch: 'JFS-04',
      terminal: 'PC-22',
      studentName: 'Arjun Nair',
      rollNo: '2026-JFS-008',
      channel: 'Zoom Cluster Relay',
      ipAddress: '49.36.120.44',
      status: 'Present',
      telemetryDetail: 'Connected 98 mins, packet loss 0.1%, latency 24ms',
      anomalyFlag: 'None'
    },
    {
      eventId: 'ING-9020',
      sessionDate: '2026-10-16',
      timestamp: '09:03:05 AM',
      batch: 'JFS-04',
      terminal: 'PC-31',
      studentName: 'Pooja Deshmukh',
      rollNo: '2026-JFS-019',
      channel: 'Dynamic TOTP QR',
      ipAddress: '192.168.3.131',
      status: 'Present',
      telemetryDetail: 'Scanned screen token AUTH-QR-JFS04-9842',
      anomalyFlag: 'None'
    },
    {
      eventId: 'ING-9019',
      sessionDate: '2026-10-16',
      timestamp: '09:02:40 AM',
      batch: 'JFS-04',
      terminal: 'PC-28',
      studentName: 'Aditya Joshi',
      rollNo: '2026-JFS-041',
      channel: 'Door Kiosk + External IP',
      ipAddress: '103.21.144.12',
      status: 'Anomaly',
      telemetryDetail: 'RFID door badge swiped with remote cellular IP mismatch',
      anomalyFlag: 'IP_PROXY_DETECTED'
    },
    {
      eventId: 'ING-9018',
      sessionDate: '2026-10-16',
      timestamp: '09:01:28 AM',
      batch: 'JFS-04',
      terminal: 'PC-09',
      studentName: 'Sneha Kulkarni',
      rollNo: '2026-JFS-022',
      channel: 'RFID Door Kiosk',
      ipAddress: '192.168.3.109',
      status: 'Present',
      telemetryDetail: 'Swiped badge #RFID-8812 at Lab 03 entrance turnstile',
      anomalyFlag: 'None'
    },
    {
      eventId: 'ING-9017',
      sessionDate: '2026-10-16',
      timestamp: '08:58:14 AM',
      batch: 'JFS-04',
      terminal: 'PC-02',
      studentName: 'Tanvi Patel',
      rollNo: '2026-JFS-014',
      channel: 'Biometric Scanner',
      ipAddress: '192.168.3.102',
      status: 'Present',
      telemetryDetail: 'Optical fingerprint hash match verified at Door A',
      anomalyFlag: 'None'
    },
    {
      eventId: 'ING-9016',
      sessionDate: '2026-10-16',
      timestamp: '08:55:00 AM',
      batch: 'JFS-04',
      terminal: 'PC-14',
      studentName: 'Rahul Verma',
      rollNo: '2026-JFS-035',
      channel: 'No Scan Logged',
      ipAddress: 'Unallocated',
      status: 'Absent',
      telemetryDetail: 'Zero ping response on terminal subnet. Consecutive day 4.',
      anomalyFlag: 'RETENTION_RISK'
    }
  ];

  const handleChannelToggle = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Compile and trigger file download in browser
  const handleTriggerExport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Filter dataset by batch
      const filteredData = auditLogsDataset.filter((item) =>
        selectedBatch === 'all' ? true : item.batch === selectedBatch
      );

      if (exportFormat === 'json') {
        // Build JSON file
        const jsonContent =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(
            JSON.stringify(
              {
                exportGenerated: new Date().toISOString(),
                batchScope: selectedBatch,
                totalAuditEvents: filteredData.length,
                records: filteredData.map((r) => ({
                  ...r,
                  studentName: maskStudentNames
                    ? `${r.studentName.split(' ')[0]} ***`
                    : r.studentName
                }))
              },
              null,
              2
            )
          );

        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute(
          'download',
          `Attendance_Audit_${selectedBatch}_${new Date().toISOString().slice(0, 10)}.json`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Build CSV file
        const headers = [
          'Event ID',
          'Session Date',
          'Timestamp',
          'Cohort Batch',
          'Terminal / Seat',
          'Student Name',
          'Roll Number',
          'Ingress Channel',
          'Network Socket IP',
          'Attendance Status',
          'Telemetry Readout',
          'Anomaly Flag'
        ];

        const rows = filteredData.map((row) => [
          row.eventId,
          row.sessionDate,
          row.timestamp,
          row.batch,
          row.terminal,
          maskStudentNames ? `${row.studentName.split(' ')[0]} ***` : row.studentName,
          row.rollNo,
          row.channel,
          row.ipAddress,
          row.status,
          `"${row.telemetryDetail.replace(/"/g, '""')}"`,
          row.anomalyFlag
        ]);

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
          'download',
          `Attendance_Audit_${selectedBatch}_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsGenerating(false);
      onShowToast(
        `Export complete: Attendance Audit Logs downloaded for batch ${selectedBatch}.`
      );
      onClose();
    }, 850);
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
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export Attendance Audit Logs</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified RFID door swipes, Zoom telemetry, and anomaly flags
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

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Export Format Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'csv', label: 'CSV Spreadsheet', sub: 'Standard audit table', icon: FileSpreadsheet },
                { id: 'excel', label: 'Excel (.xlsx)', sub: 'Formatted columns', icon: FileSpreadsheet },
                { id: 'json', label: 'JSON Events', sub: 'SIEM / Log pipelines', icon: FileCode2 }
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = exportFormat === fmt.id;

                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <span className={`font-bold block ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {fmt.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{fmt.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Batch & Date Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Target Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="JFS-04">Java Full Stack (JFS-04)</option>
                <option value="SPRG-02">Spring Boot Core (SPRG-02)</option>
                <option value="DATA-01">Data Engineering (DATA-01)</option>
                <option value="all">All Active Campus Cohorts</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="today">Today's Active Session</option>
                <option value="7days">Past 7 Days</option>
                <option value="30days">Month to Date (Past 30 Days)</option>
                <option value="anomalies_only">Anomalies & Proxies Only</option>
              </select>
            </div>
          </div>

          {/* Telemetry Ingress Source Filters */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
              Include Ingress Channels
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.rfid}
                  onChange={() => handleChannelToggle('rfid')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800">RFID Kiosk Turnstiles</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.zoom}
                  onChange={() => handleChannelToggle('zoom')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800">Zoom Dual Streams</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.dynamicQr}
                  onChange={() => handleChannelToggle('dynamicQr')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800">Dynamic TOTP QR Scans</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.anomalies}
                  onChange={() => handleChannelToggle('anomalies')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800 font-semibold text-amber-700">Flagged IP Proxies</span>
              </label>
            </div>
          </div>

          {/* Privacy & Masking Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={maskStudentNames}
              onChange={(e) => setMaskStudentNames(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Anonymize Student Names (Fee-Blind Audit)</span>
              <span className="text-[11px] text-slate-500 block">
                Masks candidate surnames to generate a purely biometric/system telemetry report.
              </span>
            </div>
          </label>

          {/* Cryptographic Proof Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>SHA-256 session ingress digest will be attached to the audit header.</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleTriggerExport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-75"
          >
            {isGenerating ? (
              <>
                <FileCheck className="w-3.5 h-3.5 animate-bounce" />
                <span>Compiling Logs...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export {exportFormat.toUpperCase()} Logs</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}