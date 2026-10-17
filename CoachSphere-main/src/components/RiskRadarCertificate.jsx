import React, { useState } from 'react';
import {
  Radar,
  Award,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  Sparkles,
  Send,
  Eye,
  FileCheck,
  Check,
  TrendingDown,
  UserCheck,
  Filter,
  ExternalLink,
  QrCode,
  GraduationCap
} from 'lucide-react';

export default function RiskRadarCertificates({ onShowToast = () => {} }) {
  const [activeSubTab, setActiveSubTab] = useState('radar'); // 'radar' | 'certificates'
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all'); // 'all' | 'critical' | 'elevated' | 'moderate'

  // 1. Predictive Dropout Radar Student Records
  const [atRiskStudents, setAtRiskStudents] = useState([
    {
      id: 'STU-101',
      name: 'Rahul Verma',
      batch: 'Java Full Stack (JFS-04)',
      overallRisk: 94,
      riskLevel: 'critical', // 'critical' | 'elevated' | 'moderate'
      attendanceLag: '4 consecutive sessions missed',
      academicLag: 'Sprint 3 Microservices Lab PR missing',
      feeLag: '₹12,500 EMI overdue by 2 days',
      predictedDropoutWindow: 'Next 5 days',
      interventionStatus: 'Pending Counselor Nudge'
    },
    {
      id: 'STU-102',
      name: 'Sneha Kulkarni',
      batch: 'Java Full Stack (JFS-04)',
      overallRisk: 78,
      riskLevel: 'elevated',
      attendanceLag: '3 remote meets unpinged',
      academicLag: 'Quiz 4 test score 42% (below 65% bar)',
      feeLag: '₹12,500 EMI due in 3 days',
      predictedDropoutWindow: 'Next 10 days',
      interventionStatus: '1:1 Doubt Slot Staged'
    },
    {
      id: 'STU-103',
      name: 'Arjun Nair',
      batch: 'Java Full Stack (JFS-04)',
      overallRisk: 71,
      riskLevel: 'elevated',
      attendanceLag: '2 offline absences, 1 online drop',
      academicLag: 'Docker container crash unresolved',
      feeLag: '₹15,000 EMI due in 5 days',
      predictedDropoutWindow: 'Next 12 days',
      interventionStatus: 'Technical Review Pending'
    },
    {
      id: 'STU-106',
      name: 'Pooja Deshmukh',
      batch: 'DevOps & Cloud (DO-08)',
      overallRisk: 52,
      riskLevel: 'moderate',
      attendanceLag: '82% total attendance (slipping)',
      academicLag: 'Kubernetes deployment delayed',
      feeLag: 'All dues cleared',
      predictedDropoutWindow: 'Stable if reviewed',
      interventionStatus: 'Automated Slack Alert Sent'
    }
  ]);

  // 2. Certificate Issuance & Verification Records (3-Gate Rule)
  const [certificateRegistry, setCertificateRegistry] = useState([
    {
      id: 'CERT-2026-901',
      studentName: 'Tanvi Patel',
      batch: 'Java Full Stack (JFS-04)',
      completionDate: '14 Oct 2026',
      attendanceScore: 94, // Gate 1: >= 80%
      projectScore: 92,    // Gate 2: >= 70%
      ledgerCleared: true, // Gate 3: Dues == 0
      credentialHash: 'sha256-8f92b7c4a1e902b3',
      status: 'issued' // 'issued' | 'eligible' | 'blocked'
    },
    {
      id: 'CERT-2026-902',
      studentName: 'Aditya Joshi',
      batch: 'DevOps & Cloud (DO-08)',
      completionDate: '15 Oct 2026',
      attendanceScore: 88,
      projectScore: 85,
      ledgerCleared: true,
      credentialHash: 'sha256-3c71a9e88b2f9011',
      status: 'eligible'
    },
    {
      id: 'CERT-2026-903',
      studentName: 'Sneha Kulkarni',
      batch: 'Java Full Stack (JFS-04)',
      completionDate: 'In Progress',
      attendanceScore: 74,
      projectScore: 68,
      ledgerCleared: false,
      credentialHash: null,
      status: 'blocked'
    }
  ]);

  // Handler for dispatching counselor intervention
  const handleDispatchIntervention = (studentId, studentName) => {
    setAtRiskStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, interventionStatus: 'Dispatched to Academic Counselor' } : s
      )
    );
    onShowToast(`Emergency 1:1 counseling & recovery sprint staged for ${studentName}.`);
  };

  // Handler for minting/issuing digital certificate
  const handleMintCertificate = (certId, studentName) => {
    setCertificateRegistry((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, status: 'issued' } : c))
    );
    onShowToast(`Cryptographic Certificate ${certId} minted & emailed to ${studentName}.`);
  };

  const filteredStudents = atRiskStudents.filter((student) => {
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Navigation Switcher */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            {activeSubTab === 'radar' ? <Radar className="w-5 h-5" /> : <Award className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {activeSubTab === 'radar' ? 'Dropout Early Warning Radar' : 'Automated Credentialing & Certificates'}
              </h2>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                {activeSubTab === 'radar' ? '14-Day Predictive Horizon' : '3-Gate Zero-Trust Issuance'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeSubTab === 'radar'
                ? 'Correlating attendance drop-off, quiz delays, and fee reminders to prevent student attrition.'
                : 'Verifying attendance thresholds, technical project approval, and full fee settlement before minting.'}
            </p>
          </div>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('radar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'radar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Dropout Radar</span>
          </button>
          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'certificates' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates & Verification</span>
          </button>
        </div>
      </section>

      {/* 2. Top Metric Ticker */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Students Flagged</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-600">14 Active</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded">
              3 High Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Correlated across 18 batches</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Retention Shield Rate</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">84.2%</span>
            <span className="text-xs text-emerald-600 font-semibold">+3.5% Q4</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Saved 12 dropouts this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Protected</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">₹3.75 Lakhs</span>
            <span className="text-xs text-indigo-600 font-semibold">Protected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Fee attrition avoided</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certificates Minted</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">89 Issued</span>
            <span className="text-xs text-emerald-600 font-semibold">100% Validated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero unfulfilled gate violations</p>
        </div>
      </section>

      {/* ================= VIEW 1: DROPOUT RADAR ================= */}
      {activeSubTab === 'radar' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">High-Risk Candidates (Early Intervention Horizon)</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  {filteredStudents.length} Students
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI correlates attendance drop-off, missing lab assignments, and fee reminders.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative flex items-center w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, batch..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Filter Risk:</span>
            {[
              { id: 'all', label: 'All Candidates' },
              { id: 'critical', label: 'Critical (80-100%)' },
              { id: 'elevated', label: 'Elevated (65-79%)' },
              { id: 'moderate', label: 'Moderate' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRiskFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  riskFilter === f.id ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Radar Table */}
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-2.5 px-3 rounded-l-lg">Student Profile</th>
                  <th className="py-2.5 px-3">Attrition Vector (Pedagogical & Financial)</th>
                  <th className="py-2.5 px-3">Dropout Score</th>
                  <th className="py-2.5 px-3">Intervention Status</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isCritical = student.riskLevel === 'critical';
                  const isElevated = student.riskLevel === 'elevated';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student Profile */}
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-slate-900 block">{student.name}</span>
                          <span className="text-[11px] text-slate-500">{student.batch}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{student.id}</span>
                        </div>
                      </td>

                      {/* Vector breakdown */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1.5 text-rose-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            <span>{student.attendanceLag}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{student.academicLag}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{student.feeLag}</span>
                          </div>
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-3">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-lg font-bold ${
                              isCritical ? 'text-rose-600' : isElevated ? 'text-amber-600' : 'text-slate-700'
                            }`}
                          >
                            {student.overallRisk}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Risk Index</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">Est: {student.predictedDropoutWindow}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          {student.interventionStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">Counselor SLA: &lt; 24h</span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDispatchIntervention(student.id, student.name)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Counselor</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= VIEW 2: CERTIFICATES & CREDENTIALING ================= */}
      {activeSubTab === 'certificates' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Certificate Issuance Registry</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  Automated Gate Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every certificate requires 3 gates passed: Attendance &ge; 80%, Projects approved, and Zero balance.
              </p>
            </div>

            <button
              onClick={() => onShowToast('Exported Master Credential Ledger (CSV / JSON).')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-2.5 px-3 rounded-l-lg">Student / Credential</th>
                  <th className="py-2.5 px-3">Gate 1: Attendance (&ge;80%)</th>
                  <th className="py-2.5 px-3">Gate 2: Project Score</th>
                  <th className="py-2.5 px-3">Gate 3: Ledger Cleared</th>
                  <th className="py-2.5 px-3">Issuance State</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificateRegistry.map((cert) => {
                  const isIssued = cert.status === 'issued';
                  const isEligible = cert.status === 'eligible';
                  const isBlocked = cert.status === 'blocked';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-slate-900 block">{cert.studentName}</span>
                          <span className="text-[11px] text-slate-500">{cert.batch}</span>
                          {cert.credentialHash && (
                            <span className="text-[10px] font-mono text-indigo-600 block mt-0.5">
                              {cert.credentialHash}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Gate 1 */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {cert.attendanceScore >= 80 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className={cert.attendanceScore >= 80 ? 'font-semibold text-slate-900' : 'text-rose-600 font-semibold'}>
                            {cert.attendanceScore}%
                          </span>
                        </div>
                      </td>

                      {/* Gate 2 */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {cert.projectScore >= 70 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className={cert.projectScore >= 70 ? 'font-semibold text-slate-900' : 'text-rose-600 font-semibold'}>
                            {cert.projectScore}% Pass
                          </span>
                        </div>
                      </td>

                      {/* Gate 3 */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {cert.ledgerCleared ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                              Zero Balance
                            </span>
                          ) : (
                            <span className="text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
                              Pending Dues
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {isIssued && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Minted & Verified
                          </span>
                        )}
                        {isEligible && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3" /> 3 Gates Passed
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Blocked by Policy
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        {isEligible && (
                          <button
                            onClick={() => handleMintCertificate(cert.id, cert.studentName)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Issue Certificate</span>
                          </button>
                        )}
                        {isIssued && (
                          <button
                            onClick={() => onShowToast(`Downloaded Verified PDF Certificate for ${cert.studentName}.`)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        )}
                        {isBlocked && (
                          <span className="text-[11px] text-slate-400 italic">Ineligible</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}