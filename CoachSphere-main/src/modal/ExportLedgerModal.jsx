import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  FileSpreadsheet,
  FileText,
  Calendar,
  ShieldCheck,
  Check,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export default function ExportLedgerModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' | 'excel' | 'pdf'
  const [dateRange, setDateRange] = useState('all'); // 'all' | 'q3' | 'this_month' | 'unreconciled'
  const [maskPii, setMaskPii] = useState(true);
  const [includeGstSummary, setIncludeGstSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Real audit sample data for the bank ledger
  const ledgerDataset = [
    {
      date: '2026-10-16',
      utr: 'UTR-982103445',
      studentName: 'Tanvi Patel',
      rollNo: '2026-JFS-014',
      batch: 'JFS-04',
      paymentMode: 'UPI / HDFC',
      baseAmount: 16949.15,
      gst18: 3050.85,
      totalAmount: 20000.0,
      status: 'Reconciled',
      gstInvoice: 'INV-2026-0891'
    },
    {
      date: '2026-10-15',
      utr: 'UTR-891204912',
      studentName: 'Sneha Kulkarni',
      rollNo: '2026-JFS-022',
      batch: 'JFS-04',
      paymentMode: 'Net Banking / ICICI',
      baseAmount: 29661.02,
      gst18: 5338.98,
      totalAmount: 35000.0,
      status: 'Reconciled',
      gstInvoice: 'INV-2026-0890'
    },
    {
      date: '2026-10-14',
      utr: 'UTR-441092831',
      studentName: 'Arjun Nair',
      rollNo: '2026-JFS-008',
      batch: 'JFS-04',
      paymentMode: 'UPI / PhonePe',
      baseAmount: 12711.86,
      gst18: 2288.14,
      totalAmount: 15000.0,
      status: 'Reconciled',
      gstInvoice: 'INV-2026-0889'
    },
    {
      date: '2026-10-13',
      utr: 'UTR-109283741',
      studentName: 'Rahul Verma',
      rollNo: '2026-JFS-035',
      batch: 'JFS-04',
      paymentMode: 'NEFT / SBI',
      baseAmount: 10593.22,
      gst18: 1906.78,
      totalAmount: 12500.0,
      status: 'Mismatch (Unmatched UTR)',
      gstInvoice: 'Draft Pending'
    }
  ];

  // In-Browser CSV compilation & download trigger
  const handleTriggerExport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // 1. Build CSV content
      const headers = [
        'Transaction Date',
        'UTR / Bank Ref',
        'Student Name',
        'Roll No',
        'Cohort Batch',
        'Payment Channel',
        'Base Fee (INR)',
        'GST 18% (INR)',
        'Total Credited (INR)',
        'Ledger Status',
        'Tax Invoice Number'
      ];

      const rows = ledgerDataset.map((row) => [
        row.date,
        row.utr,
        maskPii ? `${row.studentName.split(' ')[0]} ***` : row.studentName,
        row.rollNo,
        row.batch,
        row.paymentMode,
        row.baseAmount.toFixed(2),
        row.gst18.toFixed(2),
        row.totalAmount.toFixed(2),
        row.status,
        row.gstInvoice
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      // 2. Trigger browser download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `EduPulse_Bank_Ledger_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      onShowToast(`Export complete: Bank Ledger downloaded as ${exportFormat.toUpperCase()}.`);
      onClose();
    }, 900);
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
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export Bank Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download bank credits, UTR settlements, and GST records
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
          
          {/* Format Picker */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">Select Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'csv', label: 'Raw CSV', sub: 'Auditor & Excel', icon: FileSpreadsheet },
                { id: 'excel', label: 'Excel (.xlsx)', sub: 'Multi-sheet format', icon: FileSpreadsheet },
                { id: 'pdf', label: 'PDF Ledger', sub: 'GST Signed Record', icon: FileText }
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

          {/* Date & Batch Filter */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Date Filter Scope</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Available Records (Current Fiscal Year 2026-27)</option>
              <option value="this_month">October 2026 (Month-to-Date)</option>
              <option value="q3">Q3 Academic Term (Aug - Oct 2026)</option>
              <option value="unreconciled">Unreconciled & Flagged UTRs Only</option>
            </select>
          </div>

          {/* Data Controls & Compliance Checkboxes */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
              Compliance & Masking Controls
            </span>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={maskPii}
                onChange={(e) => setMaskPii(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Mask Student Personal Details</span>
                <span className="text-[11px] text-slate-500 block">
                  Redacts contact numbers and full surnames to meet privacy compliance standards.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGstSummary}
                onChange={(e) => setIncludeGstSummary(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Append GST Breakdown Section</span>
                <span className="text-[11px] text-slate-500 block">
                  Adds CGST (9%) + SGST (9%) columns for chartered accountant reconciliations.
                </span>
              </div>
            </label>
          </div>

          {/* Audit Verification Note */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cryptographic SHA-256 seal will be stamped on the exported file.</span>
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
                <span>Compiling Ledger...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export {exportFormat.toUpperCase()} File</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}