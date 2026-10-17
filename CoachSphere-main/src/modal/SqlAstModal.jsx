import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';

export default function SqlAstModal({ isOpen, onClose, onShowToast = () => {} }) {
  const [activeTab, setActiveTab] = useState('sql'); // 'sql' | 'ast'
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawSql = `-- EduPulse Sovereign Runtime: AST Guard Enforced
-- Intent: Correlate attendance velocity with EMI defaults (JFS-04)
SELECT 
    s.id AS student_id,
    s.name AS student_name,
    s.phone_number,
    b.batch_code,
    COUNT(a.id) FILTER (WHERE a.status = 'absent') AS consecutive_absences,
    f.due_amount,
    f.due_date,
    f.status AS installment_status
FROM students s
INNER JOIN batches b 
    ON s.batch_id = b.id
INNER JOIN attendance_logs a 
    ON s.id = a.student_id
INNER JOIN fee_ledgers f 
    ON s.id = f.student_id
WHERE b.batch_code = 'JFS-04'
  AND a.session_date >= CURRENT_DATE - INTERVAL '14 days'
  AND f.status IN ('overdue', 'due_soon')
GROUP BY s.id, s.name, s.phone_number, b.batch_code, f.due_amount, f.due_date, f.status
HAVING COUNT(a.id) FILTER (WHERE a.status = 'absent') >= 3
ORDER BY consecutive_absences DESC;`;

  const astTree = [
    {
      type: 'SelectStatement',
      cost: '0.04 ms',
      children: [
        {
          type: 'ProjectionClause',
          items: ['s.id', 's.name', 's.phone_number', 'consecutive_absences', 'f.due_amount']
        },
        {
          type: 'FromClause',
          target: 'students AS s'
        },
        {
          type: 'JoinTree',
          joins: [
            { type: 'INNER JOIN', table: 'batches AS b', condition: 's.batch_id = b.id' },
            { type: 'INNER JOIN', table: 'attendance_logs AS a', condition: 's.id = a.student_id' },
            { type: 'INNER JOIN', table: 'fee_ledgers AS f', condition: 's.id = f.student_id' }
          ]
        },
        {
          type: 'FilterPredicate (WHERE)',
          rules: [
            "b.batch_code = 'JFS-04'",
            "a.session_date >= NOW() - 14d",
            "f.status IN ('overdue', 'due_soon')"
          ]
        },
        {
          type: 'AggregatePredicate (HAVING)',
          rules: ['COUNT(absences) >= 3']
        }
      ]
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(rawSql);
    setCopied(true);
    onShowToast('SQL Query copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 2. Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#091426] text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Abstract Syntax Tree (AST) & SQL Inspector
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Sanitized
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deterministic parser inspection with runtime AST query guard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Bar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compile Latency:</span> <strong className="text-emerald-400">24ms</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plan:</span> <span className="text-indigo-300">IndexScan(idx_batch_attendance)</span>
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Formatted SQL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ast')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ast'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AST Tree</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Code Viewport */}
        <div className="p-6 overflow-y-auto font-mono text-xs space-y-4">
          {activeTab === 'sql' ? (
            <div className="relative group">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-emerald-300 overflow-x-auto leading-relaxed selection:bg-indigo-500/30">
                <code>{rawSql}</code>
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  Root Node: {astTree[0].type}
                </span>

                <div className="space-y-2.5 pl-3 border-l-2 border-indigo-500/40 mt-2 font-mono text-xs">
                  {astTree[0].children.map((child, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <span className="text-emerald-400 font-bold block mb-1">{child.type}</span>
                      {child.items && (
                        <div className="text-slate-300 text-[11px] pl-2">
                          Columns: <span className="text-slate-400">{child.items.join(', ')}</span>
                        </div>
                      )}
                      {child.target && (
                        <div className="text-slate-300 text-[11px] pl-2">
                          Source: <span className="text-slate-400">{child.target}</span>
                        </div>
                      )}
                      {child.joins && (
                        <ul className="text-slate-400 text-[11px] pl-2 space-y-0.5">
                          {child.joins.map((j, idx) => (
                            <li key={idx}>
                              <strong className="text-indigo-300">{j.type}</strong> {j.table} ON {j.condition}
                            </li>
                          ))}
                        </ul>
                      )}
                      {child.rules && (
                        <ul className="text-slate-400 text-[11px] pl-2 space-y-0.5">
                          {child.rules.map((r, idx) => (
                            <li key={idx} className="text-amber-300/90">• {r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Zero Mutation Policy (Read-Only Replica AST)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}