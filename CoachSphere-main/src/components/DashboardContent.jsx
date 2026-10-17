import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Database,
  Activity,
  Info,
  Check,
  X,
  Send,
  MessageSquare,
  AlertTriangle,
  TerminalSquare
} from 'lucide-react';

import SqlAstModal from '../modal/SqlAstModal';
import { apiRequest } from '../api/client';

export default function Dashboardcontent({
  role = 'director',
  isTrainer = false,
  user,
  cards = {
    rahul: { visible: true, approved: false },
    batchWa: { visible: true, approved: false },
  },
  approvedCount = 0,
  onApprove = () => {},
  onDismiss = () => {},
  onInspectCard = () => {},
  onShowToast = () => {}
}) {
  // Toggle for inspecting the Sovereign Runtime SQL AST query
  const [showSql, setShowSql] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [copilotResult, setCopilotResult] = useState(null);
  const [actionState, setActionState] = useState({});

  const handleRunCopilot = async () => {
    const message = prompt.trim();
    if (!message || isQuerying) return;
    setIsQuerying(true);
    setPrompt('');
    setMessages((current) => [...current, { role: 'user', content: message }]);

    try {
      const result = await apiRequest('/api/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
        }),
      });
      setCopilotResult(result);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: getResponseSummary(result),
        },
      ]);
      onShowToast('Copilot response received.');
    } catch (error) {
      onShowToast(error.message || 'Copilot request failed.');
    } finally {
      setIsQuerying(false);
    }
  };

  const handlePromptKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleRunCopilot();
    }
  };

  const getResponseSummary = (result) =>
    result?.summary ||
    result?.message ||
    result?.response ||
    result?.answer ||
    result?.data?.message ||
    (typeof result === 'string' ? result : 'The assistant returned no summary.');

  const getActions = () => {
    const actions =
      copilotResult?.actions ||
      copilotResult?.staged_actions ||
      copilotResult?.data?.actions ||
      copilotResult?.data?.staged_actions ||
      [];

    return Array.isArray(actions)
      ? actions.filter((action) => !isScheduleAction(action))
      : [];
  };

  const isScheduleAction = (action) => {
    const actionText = [
      action?.title,
      action?.description,
      action?.message,
      action?.type,
      action?.action_type
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return /\b(schedule|scheduling|reschedule|replan|timetable|time\s*slot|room\s*change|shift)\b/.test(
      actionText
    );
  };

  const getResponseRows = () =>
    Array.isArray(copilotResult?.data) ? copilotResult.data : [];

  const getResponseColumns = () => {
    const columns = new Set();
    getResponseRows().forEach((row) => {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row).forEach((key) => columns.add(key));
      }
    });
    return Array.from(columns);
  };

  const handleActionDecision = async (action, decision) => {
    const actionId = action?.id || action?.action_id;
    const userId = user?.id || user?.user_id;

    if (!actionId || !userId) {
      onShowToast('The action or authenticated user ID is missing.');
      return;
    }

    setActionState((current) => ({ ...current, [actionId]: 'loading' }));

    try {
      await apiRequest(`/api/actions/${encodeURIComponent(actionId)}/${decision}`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          user_role: user?.role || user?.user_role || role,
        }),
      });
      setActionState((current) => ({ ...current, [actionId]: decision }));
      onShowToast(`Action ${decision === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } catch (error) {
      setActionState((current) => ({ ...current, [actionId]: 'error' }));
      onShowToast(error.message || `Action ${decision} failed.`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      {/* 1. COPILOT HERO COMMAND CENTER */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-200">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Operations Copilot</h2>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask the authenticated Copilot about your institute operations.
            </p>
          </div>
        </div>

        <div className="min-h-32 max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          {messages.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-center text-xs text-slate-400">
              Start a conversation with the Operations Copilot.
            </div>
          ) : (
            messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                    item.role === 'user'
                      ? 'rounded-br-sm bg-indigo-600 text-white'
                      : 'rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-200'
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))
          )}
          {isQuerying && (
            <div className="text-xs text-slate-500">Copilot is thinking...</div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="Type a message... Press Enter to send, Shift+Enter for a new line."
            aria-label="Message Operations Copilot"
            className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mt-3 flex flex-col-reverse gap-2 sm:absolute sm:bottom-3 sm:right-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsSqlModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSql ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{showSql ? 'Hide SQL AST' : 'Inspect SQL AST'}</span>
            </button>
            <button
              onClick={handleRunCopilot}
              disabled={isQuerying}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-75"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isQuerying ? 'animate-spin' : ''}`} />
              <span>{isQuerying ? 'Sending...' : 'Send message'}</span>
            </button>
          </div>
        </div>

        {/* Sovereign Runtime SQL Inspection Panel */}
        {showSql && (
          <div className="mt-2 p-4 rounded-xl bg-[#091426] text-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sovereign Runtime Execution</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Time: 42ms</span>
            </div>
            <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`SELECT s.id, s.name, s.phone 
FROM students s
JOIN attendance a ON s.id = a.student_id
JOIN fee_ledgers f ON s.id = f.student_id
WHERE a.absences >= 3 
  AND f.status = 'overdue' 
  AND s.batch_id = 'JFS-04';`}
            </pre>
          </div>
        )}

        {copilotResult && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-900">Backend Copilot Response</h3>
              <button
                type="button"
                onClick={() => {
                  setCopilotResult(null);
                  setMessages([]);
                }}
                className="text-xs text-indigo-700 hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
                {getResponseSummary(copilotResult)}
              </p>
              {typeof copilotResult?.row_count === 'number' && (
                <p className="mt-3 text-[11px] font-semibold text-slate-500">
                  {copilotResult.row_count} {copilotResult.row_count === 1 ? 'row' : 'rows'} returned
                </p>
              )}
            </div>

            {getResponseRows().length > 0 && (
              <div className="overflow-hidden rounded-lg border border-indigo-100 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                      <tr>
                        {getResponseColumns().map((column) => (
                          <th key={column} className="whitespace-nowrap px-3 py-2 font-bold">
                            {column.replaceAll('_', ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getResponseRows().map((row, rowIndex) => (
                        <tr key={row?.id || rowIndex} className="align-top">
                          {getResponseColumns().map((column) => (
                            <td key={column} className="max-w-xs break-words px-3 py-2 text-slate-700">
                              {row?.[column] === null || row?.[column] === undefined
                                ? '—'
                                : String(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {copilotResult?.executed_sql && (
              <details className="rounded-lg border border-slate-700 bg-[#091426]">
                <summary className="cursor-pointer px-3 py-2 text-xs font-bold text-slate-200">
                  View executed SQL
                </summary>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words border-t border-slate-700 p-3 text-[11px] leading-relaxed text-emerald-300">
                  {copilotResult.executed_sql}
                </pre>
              </details>
            )}

            {copilotResult?.action_preview && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
                  Action preview
                </p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-amber-950">
                  {typeof copilotResult.action_preview === 'string'
                    ? copilotResult.action_preview
                    : JSON.stringify(copilotResult.action_preview, null, 2)}
                </pre>
              </div>
            )}

            {getActions().length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {getActions().map((action, index) => {
                  const actionId = action?.id || action?.action_id || `action-${index}`;
                  const state = actionState[actionId];
                  return (
                    <div key={actionId} className="rounded-lg border border-indigo-100 bg-white p-3">
                      <p className="break-words text-xs font-semibold text-slate-900">
                        {action?.title || action?.description || action?.message || `Action ${index + 1}`}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={Boolean(state) && state !== 'error'}
                          onClick={() => handleActionDecision(action, 'approve')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                        >
                          {state === 'approve' ? 'Approved' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(state) && state !== 'error'}
                          onClick={() => handleActionDecision(action, 'reject')}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                        >
                          {state === 'reject' ? 'Rejected' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. HUMAN-IN-THE-LOOP (HITL) APPROVAL CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Staged Actions (Human-in-the-Loop)</h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {approvedCount} / 2 Approved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Student Nudge */}
          {cards.rahul.visible && (
            <div id="card-rahul" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    <AlertTriangle className="w-3 h-3" /> High Risk
                  </span>
                  {cards.rahul.approved && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">WhatsApp Reminder: Rahul Verma</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Rahul has missed 3 consecutive classes and has a ₹12,500 EMI overdue by 2 days. Drafted supportive payment link & catch-up nudge.
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onDismiss('rahul')}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  disabled={cards.rahul.approved}
                  onClick={() => onApprove('rahul', 'WhatsApp reminder dispatched to Rahul Verma.')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    cards.rahul.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{cards.rahul.approved ? 'Dispatched' : 'Approve Send'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Batch Update */}
          {cards.batchWa.visible && (
            <div id="card-batch" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <Info className="w-3 h-3" /> Broadcast
                  </span>
                  {cards.batchWa.approved && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Alert Batch JFS-04</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Drafted general WhatsApp broadcast to notify the rest of the batch about the revised project deadline dates.
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onDismiss('batchWa')}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  disabled={cards.batchWa.approved}
                  onClick={() => onApprove('batchWa', 'Batch broadcast sent successfully.')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    cards.batchWa.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{cards.batchWa.approved ? 'Sent' : 'Approve Broadcast'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
      {/* SQL AST Popup Modal */}
<SqlAstModal
  isOpen={isSqlModalOpen}
  onClose={() => setIsSqlModalOpen(false)}
  onShowToast={onShowToast}
/>
    </div>
  );
}