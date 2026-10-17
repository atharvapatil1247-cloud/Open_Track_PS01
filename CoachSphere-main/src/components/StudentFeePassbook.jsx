import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Clock,
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  Receipt,
  ArrowDownLeft
} from 'lucide-react';

import DownloadPassbookModal from '../modal/DownloadPassbookModal';

export default function StudentFeePassbook({ onShowToast = () => {} }) {
  const [invoices] = useState([
    {
      receiptNo: 'REC-89203',
      installment: 'Term 1 Registration & Admission',
      amount: '₹35,000',
      paidOn: '14 Oct 2026',
      paymentMode: 'UPI / HDFC UTR-982103445',
      status: 'cleared',
      taxInvoice: 'GSTIN27AABCT9981Q1Z'
    },
    {
      receiptNo: 'REC-89204',
      installment: 'Term 2 Microservices & Cloud Lab',
      amount: '₹20,000',
      paidOn: '16 Oct 2026',
      paymentMode: 'Net Banking / ICICI 429188201',
      status: 'cleared',
      taxInvoice: 'GSTIN27AABCT9981Q1Z'
    },
    {
      receiptNo: 'PENDING-03',
      installment: 'Term 3 Capstone & Job Placement Portal',
      amount: '₹15,000',
      paidOn: 'Due by 15 Nov 2026',
      paymentMode: 'Pending Checkout',
      status: 'due',
      taxInvoice: 'Draft Invoice'
    }
  ]);

  const [isPassbookModalOpen, setIsPassbookModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Student Fee Passbook & Invoices</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Ledger Cleared (Zero Current Defaults)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated UPI UTR reconciliation with instant GST compliant receipt generation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPassbookModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Passbook PDF</span>
        </button>
      </section>

      {/* KPI Blocks */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Program Fee</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">₹70,000</span>
            <span className="text-xs text-slate-400">Total Course</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">3 Installment Structure</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Settled to Date</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600">₹55,000</span>
            <span className="text-xs text-emerald-600 font-semibold">Cleared (78%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Gate 3 Requirement Fulfilled</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Remaining Installment</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">₹15,000</span>
            <span className="text-xs text-indigo-600 font-semibold">Due Nov 15</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">No overdue penalty active</p>
        </div>
      </section>

      {/* Invoices Table */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Installment History & Tax Receipts</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3 rounded-l-lg">Receipt / Order No</th>
                <th className="py-2.5 px-3">Installment Tier</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Date / Mode</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{inv.receiptNo}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{inv.installment}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{inv.amount}</td>
                  <td className="py-3 px-3 text-slate-500">
                    <div>
                      <span>{inv.paidOn}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{inv.paymentMode}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === 'cleared' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-indigo-600" /> Upcoming Due
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {inv.status === 'cleared' ? (
                      <button
                        type="button"
                        onClick={() => onShowToast(`Downloaded Official GST Invoice ${inv.receiptNo}.`)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>GST Receipt</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onShowToast('Opening UPI QR Payment Gateway for ₹15,000.')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via UPI</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Passbook PDF & GST Invoice Modal */}
<DownloadPassbookModal
  isOpen={isPassbookModalOpen}
  onClose={() => setIsPassbookModalOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}