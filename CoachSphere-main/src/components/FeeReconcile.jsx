import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Search,
  RefreshCw,
  Sparkles,
  CreditCard,
  Send,
  Check,
  Building2,
  FileText
} from 'lucide-react';

import ExportLedgerModal from '../modal/ExportLedgerModal';

export default function FeesReconcile({ onShowToast = () => {} }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'overdue' | 'unclaimed' | 'settled'
  const [searchQuery, setSearchQuery] = useState('');
  const [isReconciling, setIsReconciling] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Unclaimed UPI & Bank Remittance Queue (Fuzzy Matcher)
  const [unclaimedQueue, setUnclaimedQueue] = useState([
    {
      id: 'TXN-98421',
      bankRef: 'HDFC / UTR 429188201',
      amount: '₹20,000',
      remitter: 'Rajeshwar Textiles (UPI)',
      remark: 'For Aman fees',
      suggestedStudent: 'Aman Rajeshwar (Data Science DS-14)',
      confidence: 94,
      status: 'pending' // 'pending' | 'reconciled'
    },
    {
      id: 'TXN-98422',
      bankRef: 'ICICI / IMPS 0918231',
      amount: '₹12,500',
      remitter: 'Sunita Verma',
      remark: 'Rahul Java course instalment 2',
      suggestedStudent: 'Rahul Verma (Java Full Stack JFS-04)',
      confidence: 98,
      status: 'pending'
    }
  ]);

  // Student Installment Ledger Records
  const [ledgerRecords, setLedgerRecords] = useState([
    {
      id: 'REC-89201',
      studentName: 'Rahul Verma',
      batch: 'JFS-04',
      installment: '2nd EMI',
      amountDue: '₹12,500',
      dueDate: '18 Oct 2026',
      status: 'overdue',
      aging: '2 days overdue',
      utrNumber: 'Pending Payment'
    },
    {
      id: 'REC-89202',
      studentName: 'Sneha Kulkarni',
      batch: 'JFS-04',
      installment: '2nd EMI',
      amountDue: '₹12,500',
      dueDate: '19 Oct 2026',
      status: 'overdue',
      aging: 'Due in 3 days',
      utrNumber: 'Pending Payment'
    },
    {
      id: 'REC-89203',
      studentName: 'Tanvi Patel',
      batch: 'JFS-04',
      installment: '2nd EMI',
      amountDue: '₹12,500',
      dueDate: '14 Oct 2026',
      status: 'settled',
      aging: 'Cleared on time',
      utrNumber: 'HDFC982103445'
    },
    {
      id: 'REC-89204',
      studentName: 'Aman Rajeshwar',
      batch: 'DS-14',
      installment: 'Lump Sum Term 1',
      amountDue: '₹20,000',
      dueDate: '16 Oct 2026',
      status: 'pending_match',
      aging: 'Credit Matched (Needs Click)',
      utrNumber: 'UTR 429188201'
    }
  ]);

  const handleRunAutoReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      onShowToast('Fuzzy Resolver matched 2 statement deposits to student accounts in 64ms!');
    }, 850);
  };

  const handleApproveMatch = (txnId, studentName) => {
    setUnclaimedQueue((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'reconciled' } : t))
    );
    onShowToast(`Deposit credited to ${studentName}. Receipt #REC-89204 generated.`);
  };

  const filteredRecords = ledgerRecords.filter((record) => {
    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'overdue' && record.status === 'overdue') ||
      (filterTab === 'settled' && record.status === 'settled') ||
      (filterTab === 'unclaimed' && record.status === 'pending_match');

    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Top Header & Control Strip */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Fees & Auto-Reconcile Ledger</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                98.2% Auto-Match Pass
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Deciphers UPI UTR numbers, bank remarks, and student installment accounts with SHA-256 ledger integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunAutoReconcile}
            disabled={isReconciling}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            <span>{isReconciling ? 'Matching Statements...' : 'Run Auto-Reconcile'}</span>
          </button>
          <button
          type="button"
          onClick={() => setIsExportOpen(true)}            
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bank Ledger</span>
          </button>
        </div>
      </section>

      {/* 2. Financial KPI Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Collected Revenue (Q4)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">₹48.2 Lakhs</span>
            <span className="text-xs text-emerald-600 font-semibold">+14.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">328 of 412 student installments</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Installments</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-600">₹4.85 Lakhs</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded">
              38 Students
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">₹1.4L due within 48 hours</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unclaimed Bank Remits</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600">2 Deposits</span>
            <span className="text-xs text-slate-500">₹32,500</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Fuzzy auto-matched with candidate records</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">UPI Gateway Rate</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">99.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">Zero Drops</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Direct webhook settlement</p>
        </div>
      </section>

      {/* 3. Unclaimed Statement Credits Staging Tray (AI Fuzzy Resolver) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Unclaimed Credits Staging Tray (AI Fuzzy Resolver)</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              2 Matches Staged
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Requires physical sign-off before posting to ledger</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unclaimedQueue.map((item) => {
            const isReconciled = item.status === 'reconciled';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isReconciled
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-indigo-50/40 border-indigo-100 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.bankRef}</span>
                  <span className="text-sm font-bold text-indigo-600">{item.amount}</span>
                </div>

                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="text-slate-400">Sender / Remark:</span>{' '}
                    <strong className="text-slate-800">{item.remitter}</strong> ({item.remark})
                  </div>
                  <div>
                    <span className="text-slate-400">Matched Learner:</span>{' '}
                    <span className="text-emerald-700 font-bold">{item.suggestedStudent}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    {item.confidence}% Match Confidence
                  </span>

                  <button
                    disabled={isReconciled}
                    onClick={() => handleApproveMatch(item.id, item.suggestedStudent)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isReconciled
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isReconciled ? 'Posted to Ledger' : 'Confirm & Post'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Complete Student Fee Ledger Table */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Student Installments & Ledger Records</h3>
            <span className="text-xs text-slate-400">({filteredRecords.length} records)</span>
          </div>

          <div className="relative flex items-center w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, batch, receipt..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 text-xs">
          {[
            { id: 'all', label: 'All Ledgers' },
            { id: 'overdue', label: 'Overdue EMIs' },
            { id: 'unclaimed', label: 'Matched Credits' },
            { id: 'settled', label: 'Settled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3 rounded-l-lg">Student Profile</th>
                <th className="py-2.5 px-3">Batch & Module</th>
                <th className="py-2.5 px-3">Installment Tier</th>
                <th className="py-2.5 px-3">Amount Due</th>
                <th className="py-2.5 px-3">Status / Aging</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item) => {
                const isOverdue = item.status === 'overdue';
                const isSettled = item.status === 'settled';
                const isPendingMatch = item.status === 'pending_match';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Profile */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.studentName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{item.id}</span>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700">{item.batch}</span>
                    </td>

                    {/* Installment */}
                    <td className="py-3 px-3 text-slate-600">
                      <span>{item.installment}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{item.amountDue}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.utrNumber}</span>
                    </td>

                    {/* Status & Aging */}
                    <td className="py-3 px-3">
                      {isOverdue && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-rose-600" /> Overdue
                          </span>
                          <span className="block text-[11px] text-rose-600 font-medium mt-0.5">{item.aging}</span>
                        </div>
                      )}
                      {isSettled && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">{item.aging}</span>
                        </div>
                      )}
                      {isPendingMatch && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3 text-indigo-600" /> Match Staged
                          </span>
                          <span className="block text-[11px] text-indigo-600 font-medium mt-0.5">{item.aging}</span>
                        </div>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 text-right">
                      {isOverdue ? (
                        <button
                          onClick={() => onShowToast(`WhatsApp payment nudge staged for ${item.studentName}.`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Nudge</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onShowToast(`Downloaded Official GST Receipt for ${item.studentName}.`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <ExportLedgerModal
  isOpen={isExportOpen}
  onClose={() => setIsExportOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}