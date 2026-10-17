import React from 'react';
import { Check, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out max-w-md rounded-xl bg-[#091426] text-white p-3 shadow-xl flex items-center gap-3 ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="h-8 w-8 rounded-lg bg-[#00301e] text-[#4edea3] flex items-center justify-center shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <div className="flex flex-col min-w-0 pr-3">
        <span className="text-xs font-semibold text-white">Audit Recorded</span>
        <span className="text-[11px] text-[#bcc7de] truncate">{toast.message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-[#bcc7de] hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}