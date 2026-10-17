import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  X,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  Wallet,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';

export default function DownloadPassbookModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [docType, setDocType] = useState('full_passbook'); // 'full_passbook' | 'gst_summary'
  const [isExporting, setIsExporting] = useState(false);
  const printAreaRef = useRef(null);

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

  const studentDetails = {
    name: 'Tanvi Patel',
    rollNo: '2026-JFS-014',
    batch: 'Java Full Stack Development (JFS-04)',
    center: 'Pune West Campus Core',
    totalFees: 70000,
    paidFees: 55000,
    balance: 15000,
    status: 'Active (Installment Due Nov 15)'
  };

  const ledgerRecords = [
    {
      recNo: 'REC-89203',
      date: '14 Oct 2026',
      title: 'Term 1: Registration & Lab Seat Allocation',
      mode: 'UPI / HDFC UTR-982103445',
      baseAmt: '₹29,661.02',
      gst: '₹5,338.98',
      total: '₹35,000.00',
      status: 'Settled'
    },
    {
      recNo: 'REC-89204',
      date: '16 Oct 2026',
      title: 'Term 2: Microservices & Dedicated Container Workstation',
      mode: 'Net Banking / ICICI 429188201',
      baseAmt: '₹16,949.15',
      gst: '₹3,050.85',
      total: '₹20,000.00',
      status: 'Settled'
    },
    {
      recNo: 'DRAFT-03',
      date: 'Due 15 Nov 2026',
      title: 'Term 3: Capstone Mentorship & Placement Pass',
      mode: 'Pending Payment Gateway',
      baseAmt: '₹12,711.86',
      gst: '₹2,288.14',
      total: '₹15,000.00',
      status: 'Scheduled'
    }
  ];

  // Native Print / Save to PDF Trigger
  const handlePrintPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
      onShowToast('Passbook PDF document sent to browser print engine.');
    }, 600);
  };

  // Direct CSV Export Fallback
  const handleDownloadCsv = () => {
    const headers = ['Receipt No', 'Date', 'Description', 'Payment Channel', 'Base Fee (INR)', 'GST 18% (INR)', 'Total Paid (INR)', 'Status'];
    const rows = ledgerRecords.map(r => [
      r.recNo,
      r.date,
      `"${r.title}"`,
      r.mode,
      r.baseAmt.replace('₹', '').replace(',', ''),
      r.gst.replace('₹', '').replace(',', ''),
      r.total.replace('₹', '').replace(',', ''),
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPulse_Fee_Passbook_${studentDetails.rollNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Fee ledger exported as structured CSV.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 2. Modal Window */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Student Fee Passbook</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically certified academic financial ledger & GST tax invoices
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

        {/* Action / Viewport Controls */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDocType('full_passbook')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                docType === 'full_passbook'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Consolidated Passbook
            </button>
            <button
              type="button"
              onClick={() => setDocType('gst_summary')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                docType === 'gst_summary'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tax Audit Summary
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download .CSV</span>
          </button>
        </div>

        {/* Printable Passbook Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800" ref={printAreaRef}>
          
          {/* Certificate Style Header */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">EduPulse Institute of Technology</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Official Record
                </span>
              </div>
              <p className="text-[11px] text-slate-500">GSTIN: 27AABCT9981Q1Z • Academic Year 2026-27</p>
              <p className="text-[11px] text-slate-500">Campus: West Pune Technology Hub, Maharashtra</p>
            </div>

            <div className="flex flex-col items-start sm:items-end font-mono text-[11px]">
              <span className="text-slate-400">DOCUMENT HASH</span>
              <span className="font-bold text-slate-800">SHA-256: 8f4a...92b1</span>
              <span className="text-[10px] text-slate-400 mt-1">Generated: 17 Oct 2026</span>
            </div>
          </div>

          {/* Student Profile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Learner Name</span>
              <span className="font-bold text-slate-900 block mt-0.5">{studentDetails.name}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll Number</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{studentDetails.rollNo}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Program Fee</span>
              <span className="font-bold text-slate-900 block mt-0.5">₹{studentDetails.totalFees.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Settled to Date</span>
              <span className="font-bold text-emerald-800 block mt-0.5">₹{studentDetails.paidFees.toLocaleString()}</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Installment Breakdown</h4>
              <span className="text-[11px] text-slate-400">3 of 3 Schedules Accounted</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Receipt / Ref</th>
                    <th className="py-2.5 px-3">Installment Description</th>
                    <th className="py-2.5 px-3">Base Amount</th>
                    <th className="py-2.5 px-3">GST (18%)</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                        {r.recNo}
                        <span className="block text-[10px] text-slate-400 font-sans mt-0.5">{r.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{r.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{r.mode}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{r.baseAmt}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{r.gst}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        {r.total}
                        <span className={`block text-[10px] font-sans font-semibold mt-0.5 ${
                          r.status === 'Settled' ? 'text-emerald-600' : 'text-indigo-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Watermark & Seal */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block">QR Verification Stamp</span>
                <span>Scan with the EduPulse Portal to verify authentic institutional seal.</span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Dues Flag Clear</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-75"
          >
            {isExporting ? (
              <>
                <Printer className="w-3.5 h-3.5 animate-spin" />
                <span>Preparing PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}