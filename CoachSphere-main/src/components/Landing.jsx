import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Fingerprint,
  Receipt,
  Radar,
  Timer,
  Clock,
  Sparkles,
  Users,
  Layers,
  RotateCcw,
  Sliders,
  Terminal,
  Lock,
  UserCheck
} from 'lucide-react';

// 1. Direct import of Auth.jsx and Dashboard.jsx
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';

const SCENARIOS = {
  dropout: {
    id: 'dropout',
    tabLabel: '1. Dropout & EMI Radar',
    latency: 'Execution: 42ms',
    prompt:
      '"Which students in the Java Full Stack batch have missed 3 or more classes and have an EMI due this week? Draft a WhatsApp reminder for each."',
    sqlTokens: [
      { text: 'SELECT', type: 'keyword' },
      { text: ' s.id, s.name, COUNT(a.id) ' },
      { text: 'AS', type: 'keyword' },
      { text: ' missed_classes, f.amount_due\n' },
      { text: 'FROM', type: 'keyword' },
      { text: ' students s\n' },
      { text: 'JOIN', type: 'keyword' },
      { text: ' attendances a ' },
      { text: 'ON', type: 'keyword' },
      { text: ' a.student_id = s.id\n' },
      { text: 'WHERE', type: 'keyword' },
      { text: " s.batch_id = 'JFS-04' " },
      { text: 'AND', type: 'keyword' },
      { text: " a.status = 'ABSENT'...\n" },
      { text: '/* AST Verification: Read-only query confirmed (0-Mutation Guaranteed) */', type: 'comment' }
    ],
    rbacDesc:
      'Faculty and Trainers see attendance trends and labs, but financial amounts are masked automatically at the AST boundary. Financial data is strictly unmasked for Director and Accounts credentials.',
    actionBadge: '3 Actions Staged',
    queueItems: [
      {
        name: 'Rahul Verma',
        meta: 'Missed 4 Sessions (Lab 3) • Due in 2 days',
        badge: 'EMI ₹12,500',
        badgeColor: 'text-rose-600 bg-rose-50 border-rose-200'
      },
      {
        name: 'Sneha Kulkarni',
        meta: 'Missed 3 Sessions • Due in 3 days',
        badge: 'EMI ₹12,500',
        badgeColor: 'text-rose-600 bg-rose-50 border-rose-200'
      }
    ],
    msgTitle: 'Generated WhatsApp Notification',
    msgBody:
      '“Hi Rahul, TechSummitTrainers noticed you missed 4 sessions in Full Stack Java. A doubt-clearing slot is reserved with Priya. Also, a gentle reminder that your 2nd EMI of ₹12,500 is due on 18 Oct.”',
    btnLabel: 'Approve & Dispatch 3 Reminders'
  },
  clash: {
    id: 'clash',
    tabLabel: '2. Emergency Room Swap',
    latency: 'Execution: 1.4s Solver',
    prompt:
      '"Trainer Rajiv Sen marked SICK for tomorrow. Re-plan DevOps-08 batch in Lab 101 without colliding with React-14."',
    sqlTokens: [
      { text: 'CALL', type: 'keyword' },
      { text: ' solve_timetable_replan(\n  sick_trainer => ' },
      { text: "'Rajiv Sen'", type: 'string' },
      { text: ',\n  date => ' },
      { text: "'2026-10-19'", type: 'string' },
      { text: ',\n  enforce_room_capacity => TRUE,\n  max_daily_trainer_hours => 6.0\n);\n' },
      { text: '/* Constraint Engine: 0 Overlaps Found across 24 Batches */', type: 'comment' }
    ],
    rbacDesc:
      'Trainer schedules synchronized across physical campus and Zoom cloud clusters. Real-time calendar notifications staged for academic coordinators.',
    actionBadge: '1 Schedule Shift Staged',
    queueItems: [
      {
        name: 'DevOps-08 Relocation',
        meta: 'Assigned to Vikram Mehta (Verified Safe: 4.8h load balance)',
        badge: 'Lab B (34 Seats)',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      }
    ],
    msgTitle: 'Automated Schedule Notification',
    msgBody:
      '“DevOps-08 Batch: Tomorrow\'s 09:00 AM session relocated to Lab B under Prof. Vikram Mehta. All enrolled student calendars updated automatically.”',
    btnLabel: 'Confirm Re-Plan & Notify 34 Learners'
  },
  upi: {
    id: 'upi',
    tabLabel: '3. Unclaimed UPI Remit',
    latency: 'Execution: 64ms',
    prompt:
      '"Reconcile unverified HDFC statement credit ₹20,000 with remark \'For Aman fees\'."',
    sqlTokens: [
      { text: 'SELECT', type: 'keyword' },
      { text: ' s.id, s.name, s.parent_name, e.emi_balance\n' },
      { text: 'FROM', type: 'keyword' },
      { text: ' student_registry s\n' },
      { text: 'WHERE', type: 'keyword' },
      { text: " SIMILARITY(s.parent_name, 'Rajeshwar Textiles') > 0.85\n  " },
      { text: 'AND', type: 'keyword' },
      { text: " s.name LIKE '%Aman%';\n" },
      { text: '/* Fuzzy AST Resolver: 94% Confidence Match with Bank UTR */', type: 'comment' }
    ],
    rbacDesc:
      'Strict Accounts clearance required. Payment cleared into student ledger with SHA-256 cryptographic audit record.',
    actionBadge: '1 Remittance Match Staged',
    queueItems: [
      {
        name: 'Aman Rajeshwar (DS-14)',
        meta: 'Sender: Rajeshwar Textiles • Confidence: 94%',
        badge: 'Matched ₹20,000',
        badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
      }
    ],
    msgTitle: 'Receipt & Ledger Update',
    msgBody:
      '“Payment of ₹20,000 credited to Aman Rajeshwar (Data Science DS-14). Ledger balance cleared. Digital receipt #REC-89201 generated.”',
    btnLabel: "Post ₹20,000 to Aman's Ledger"
  }
};

export default function Landing() {
  // Page routing state: 'landing' | 'auth' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState('director');

  // Simulator state
  const [activeScenarioKey, setActiveScenarioKey] = useState('dropout');
  const [dispatchStatus, setDispatchStatus] = useState('idle');
  const [studentsCount, setStudentsCount] = useState(850);
  const [batchesCount, setBatchesCount] = useState(24);

  const activeScenario = SCENARIOS[activeScenarioKey];

  const calculatedHours = useMemo(() => {
    return (batchesCount * 0.75 + studentsCount * 0.003).toFixed(1);
  }, [batchesCount, studentsCount]);

  const calculatedRevenue = useMemo(() => {
    return ((studentsCount * 0.05 * 12500) / 100000).toFixed(1);
  }, [studentsCount]);

  const handleScenarioChange = (key) => {
    setActiveScenarioKey(key);
    setDispatchStatus('idle');
  };

  const handleApprove = () => {
    setDispatchStatus('loading');
    setTimeout(() => {
      setDispatchStatus('audited');
    }, 750);
  };

  // -------------------------------------------------------------
  // FULL WINDOW VIEW SWITCH 1: AUTH PAGE
  // -------------------------------------------------------------
  if (currentView === 'auth') {
    return (
      <Auth
        onLoginSuccess={(role = 'director') => {
          setSelectedRole(role);
          setCurrentView('dashboard'); // Switches to full Dashboard
        }}
        onNavigateToLanding={() => setCurrentView('landing')} // Goes back to Landing
      />
    );
  }

  // -------------------------------------------------------------
  // FULL WINDOW VIEW SWITCH 2: DASHBOARD PAGE
  // -------------------------------------------------------------
  if (currentView === 'dashboard') {
    return (
      <Dashboard
        initialRole={selectedRole}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // -------------------------------------------------------------
  // DEFAULT VIEW: FULL WINDOW LANDING PAGE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5eeff] transition-all">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-sm">
              E
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#091426] tracking-tight">
                CodeSphere<span className="text-[#4b41e1]">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#e5eeff] text-[#1e293b]">
                OPS COPILOT
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#45474c]">
            <a href="#simulator" className="px-3.5 py-1.5 rounded-lg hover:text-[#091426] hover:bg-[#eff4ff] transition-colors">
              Copilot Simulation
            </a>
            <a href="#pillars" className="px-3.5 py-1.5 rounded-lg hover:text-[#091426] hover:bg-[#eff4ff] transition-colors">
              Core Systems
            </a>
            <a href="#security" className="px-3.5 py-1.5 rounded-lg hover:text-[#091426] hover:bg-[#eff4ff] transition-colors">
              AST Security
            </a>
            <a href="#roi" className="px-3.5 py-1.5 rounded-lg hover:text-[#091426] hover:bg-[#eff4ff] transition-colors">
              Campus Yield
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* DIRECT CALL TO AUTH */}
            <button
              type="button"
              onClick={() => setCurrentView('auth')}
              className="hidden sm:inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-lg text-[#45474c] hover:text-[#091426] bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer"
            >
              Sign in
            </button>

            {/* DIRECT CALL TO AUTH */}
            <button
              type="button"
              onClick={() => setCurrentView('auth')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-[#091426] text-white hover:bg-[#1e293b] transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.12) 0%, rgba(203, 219, 245, 0.25) 35%, transparent 70%)'
          }}
        />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[#e5eeff] mb-6 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a472] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a472]"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-[#091426]">
              Sovereign AST Engine v2.4
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c5c6cd]"></span>
            <span className="text-xs font-bold text-[#4b41e1] uppercase tracking-wider">
              Clash-Free Orchestrator Live
            </span>
          </div>

          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#091426] tracking-tight max-w-4xl leading-[1.12]">
            The Autonomous Operations Copilot for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b41e1] via-indigo-600 to-[#1e293b]">
              Modern Training Institutes
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#45474c] max-w-2xl leading-relaxed">
            Stop managing dynamic academy logistics on spreadsheets and WhatsApp. Coach Sphere parses
            plain natural language into verified read-only SQL, resolves timetable clashes in 1.4s,
            and protects sensitive fee data with role-based AST fences.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* DIRECT CALL TO AUTH */}
            <button
              type="button"
              onClick={() => setCurrentView('auth')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4b41e1] text-white font-semibold text-sm shadow-md hover:bg-[#645efb] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Schedule Campus Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#simulator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0b1c30] font-semibold text-sm border border-[#e5eeff] hover:bg-[#eff4ff] transition-all shadow-sm"
            >
              <PlayCircle className="w-5 h-5 text-[#4b41e1]" />
              <span>Explore Interactive Simulation</span>
            </a>
          </div>

          {/* Ecosystem Badge */}
          <div className="mt-12 w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#e5eeff] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#4b41e1]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#4b41e1]">
                  Ecosystem Partnership
                </div>
                <div className="text-sm font-bold text-[#091426]">
                  Powered by Coach Sphere
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#45474c] font-medium">
              <div>
                <strong className="text-[#091426] font-bold">120+</strong> Institutes
              </div>
              <span className="text-[#c5c6cd]">•</span>
              <div>
                <strong className="text-[#091426] font-bold">45,000+</strong> Enrolled Students
              </div>
              <span className="text-[#c5c6cd]">•</span>
              <div>
                <strong className="text-[#00a472] font-bold">1.4s</strong> Conflict Solver
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE COPILOT SIMULATOR */}
        <section id="simulator" className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5eeff] text-[#4b41e1] text-xs uppercase font-bold tracking-wider mb-2">
              Interactive Live Simulator
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#091426]">
              From Natural Question to Verified Human Sign-Off
            </h2>
            <p className="text-sm text-[#45474c] mt-2">
              See how Coach Sphere handles high-stakes administrative queries without risking data leaks
              or database corruption.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5eeff] shadow-xl overflow-hidden">
            <div className="bg-[#091426] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#cbdbf5]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#4edea3]"></span>
                </div>
                <span className="font-mono text-xs text-[#cbdbf5] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 inline" /> copilot.edupulse.internal / safe-runtime
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#1e293b] text-[#00a472] font-mono font-bold tracking-tight">
                  DETERMINISTIC READ-ONLY
                </span>
                <span className="text-[#cbdbf5] font-mono text-[11px]">AST Guard: Active</span>
              </div>
            </div>

            <div className="bg-[#eff4ff] px-6 py-3 border-b border-[#e5eeff] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {Object.values(SCENARIOS).map((sc) => {
                  const isActive = activeScenarioKey === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleScenarioChange(sc.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#091426] shadow-sm font-bold border border-black/5'
                          : 'text-[#45474c] hover:text-[#091426] hover:bg-white/50'
                      }`}
                    >
                      {sc.tabLabel}
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-mono text-[#4b41e1] font-semibold flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                <span>{activeScenario.latency}</span>
              </div>
            </div>

            <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#4b41e1] flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#4b41e1]" />
                    Staff Natural Language Request
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#091426] leading-relaxed">
                    {activeScenario.prompt}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-sm">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#eff4ff]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#4b41e1] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <span className="text-xs font-bold text-[#091426]">
                        Synthesized AST Safe SQL
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#00a472] font-bold border border-emerald-100">
                      ZERO MUTATION GUARANTEED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#091426] text-[#cbdbf5] font-mono text-xs leading-relaxed overflow-x-auto shadow-inner whitespace-pre-wrap">
                    {activeScenario.sqlTokens.map((tok, idx) => {
                      if (tok.type === 'keyword') {
                        return (
                          <span key={idx} className="text-[#e2dfff] font-bold">
                            {tok.text}
                          </span>
                        );
                      }
                      if (tok.type === 'string') {
                        return (
                          <span key={idx} className="text-amber-300">
                            {tok.text}
                          </span>
                        );
                      }
                      if (tok.type === 'comment') {
                        return (
                          <span key={idx} className="text-[#4edea3]">
                            {tok.text}
                          </span>
                        );
                      }
                      return <span key={idx}>{tok.text}</span>;
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4b41e1] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#091426]">
                        Role-Based Fee Blindness Enforced
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e2dfff] text-[#091426] font-bold">
                        RBAC Layer
                      </span>
                    </div>
                    <p className="text-xs text-[#45474c] mt-1.5 leading-relaxed">
                      {activeScenario.rbacDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00a472] animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#091426]">
                        Human Approval Staging Tray
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white text-[#4b41e1] font-bold shadow-xs">
                      {activeScenario.actionBadge}
                    </span>
                  </div>

                  <div className="space-y-2.5 my-4">
                    {activeScenario.queueItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white border border-[#e5eeff] shadow-sm hover:border-[#cbdbf5] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#091426]">{item.name}</span>
                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#45474c] mt-1">{item.meta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#e5eeff] text-xs text-[#45474c] shadow-xs">
                    <strong className="text-[#091426] block text-[11px] uppercase tracking-wider mb-1 font-bold">
                      {activeScenario.msgTitle}:
                    </strong>
                    <p className="italic text-[#45474c] leading-relaxed">{activeScenario.msgBody}</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={dispatchStatus === 'loading'}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      dispatchStatus === 'audited'
                        ? 'bg-[#00a472] text-white hover:bg-[#008f63]'
                        : dispatchStatus === 'loading'
                        ? 'bg-slate-700 text-white cursor-not-allowed'
                        : 'bg-[#091426] text-white hover:bg-[#1e293b]'
                    }`}
                  >
                    {dispatchStatus === 'loading' ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Dispatching to Ledger...</span>
                      </>
                    ) : dispatchStatus === 'audited' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete & Audited</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>{activeScenario.btnLabel}</span>
                      </>
                    )}
                  </button>

                  {dispatchStatus === 'audited' ? (
                    <button
                      onClick={() => setDispatchStatus('idle')}
                      className="px-3 py-2.5 rounded-xl bg-white border border-[#e5eeff] text-xs font-semibold text-[#45474c] hover:text-[#091426] hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Reset action state"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleScenarioChange(activeScenarioKey)}
                      className="px-3 py-2.5 rounded-xl bg-white border border-[#e5eeff] text-xs font-semibold text-[#45474c] hover:text-[#091426] transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE FOUR MISSION-CRITICAL SYSTEMS */}
        <section id="pillars" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5eeff] text-[#4b41e1] text-xs uppercase font-bold tracking-wider mb-2">
              Autonomous Architecture
            </div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#091426]">
              Four Engines Designed for Operational Precision
            </h2>
            <p className="text-sm text-[#45474c] mt-2">
              Purpose-built for academies juggling high-density computer labs, remote cohorts, and
              rapid scheduling shifts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#e5eeff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#4b41e1] flex items-center justify-center mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#e5eeff] text-[#4b41e1]">
                  1.4s CONSTRAINT SOLVER
                </span>
                <h3 className="font-bold text-base text-[#091426] mt-3 mb-2">
                  Clash-Free Timetable Re-Planner
                </h3>
                <p className="text-xs text-[#45474c] leading-relaxed">
                  When an instructor reports sick, Coach Sphere recomputes lab rooms, trainer fatigue
                  limits, and WebRTC caps in under 1.4 seconds with zero overlaps.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#e5eeff] flex items-center justify-between text-xs">
                <span className="text-[#45474c]">Reschedule Time</span>
                <span className="font-mono font-bold text-[#00a472]">1.4s (was 4h)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e5eeff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00a472] flex items-center justify-center mb-5">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#00a472] border border-emerald-100">
                  DUAL-SOURCE SYNC
                </span>
                <h3 className="font-bold text-base text-[#091426] mt-3 mb-2">
                  Dual-Stream Hybrid Attendance
                </h3>
                <p className="text-xs text-[#45474c] leading-relaxed">
                  Harmonizes physical RFID biometric kiosk scans with Zoom & Google Meet participant
                  webhooks. Instantly flags learners who leave remote labs early.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#e5eeff] flex items-center justify-between text-xs">
                <span className="text-[#45474c]">Telemetry Ingress</span>
                <span className="font-mono font-bold text-[#00a472]">99.8% Accuracy</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e5eeff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#4b41e1] flex items-center justify-center mb-5">
                  <Receipt className="w-6 h-6" />
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#e5eeff] text-[#4b41e1]">
                  98.2% AUTOPASS
                </span>
                <h3 className="font-bold text-base text-[#091426] mt-3 mb-2">
                  Automated Bank & UPI Reconciliation
                </h3>
                <p className="text-xs text-[#45474c] leading-relaxed">
                  Deciphers messy parent UPI IDs, cryptic bank remarks, and split installments,
                  mapping them directly to enrolled student IDs with zero manual data entry.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#e5eeff] flex items-center justify-between text-xs">
                <span className="text-[#45474c]">Remit Reconciliation</span>
                <span className="font-mono font-bold text-[#4b41e1]">98.2% Automated</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e5eeff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-rose-600 flex items-center justify-center mb-5">
                  <Radar className="w-6 h-6" />
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                  PREDICTIVE RADAR
                </span>
                <h3 className="font-bold text-base text-[#091426] mt-3 mb-2">
                  AI Dropout Early Warning Radar
                </h3>
                <p className="text-xs text-[#45474c] leading-relaxed">
                  Correlates low attendance, quiz delays, and overdue installments to alert
                  counselors 14 days before a student silently drops out of the cohort.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#e5eeff] flex items-center justify-between text-xs">
                <span className="text-[#45474c]">Student Retention</span>
                <span className="font-mono font-bold text-rose-600">84% Protected</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: AST SECURITY ARCHITECTURE */}
        <section id="security" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="bg-[#091426] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1e293b] text-[#00a472] font-mono text-xs font-semibold mb-3">
                <ShieldCheck className="w-4 h-4 text-[#00a472]" />
                <span>INSTITUTIONAL TRUST GUARANTEE</span>
              </div>
              <h2 className="font-extrabold text-2xl sm:text-4xl">
                The Sovereign AST Security Standard
              </h2>
              <p className="text-sm sm:text-base text-[#cbdbf5] mt-2 leading-relaxed">
                Unlike untrusted LLM wrappers that can corrupt databases or leak private financial
                details, Coach Sphere executes natural language queries through an immutable Abstract
                Syntax Tree compiler.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#1e293b]/80 border border-[#cbdbf5]/10 hover:border-[#cbdbf5]/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#cbdbf5]/10 flex items-center justify-center text-[#4edea3] mb-4">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-2 text-white">Zero-Mutation SQL Sandbox</h4>
                <p className="text-xs text-[#cbdbf5] leading-relaxed">
                  Every query is parsed into mathematical tokens. Any statement containing{' '}
                  <code className="text-[#4edea3] font-mono font-bold">DROP</code>,{' '}
                  <code className="text-[#4edea3] font-mono font-bold">UPDATE</code>, or{' '}
                  <code className="text-[#4edea3] font-mono font-bold">DELETE</code> is intercepted
                  and rejected before execution.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1e293b]/80 border border-[#cbdbf5]/10 hover:border-[#cbdbf5]/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#cbdbf5]/10 flex items-center justify-center text-[#e2dfff] mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-2 text-white">Cryptographic Fee Blindness</h4>
                <p className="text-xs text-[#cbdbf5] leading-relaxed">
                  Instructors can never view student installment balances regardless of prompt
                  phrasing. Fee ledgers are scrubbed at the database driver layer for all non-finance
                  roles.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1e293b]/80 border border-[#cbdbf5]/10 hover:border-[#cbdbf5]/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#cbdbf5]/10 flex items-center justify-center text-[#4edea3] mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-2 text-white">Mandatory Human Gatekeeper</h4>
                <p className="text-xs text-[#cbdbf5] leading-relaxed">
                  High-consequence actions like batch cancellations, parent notifications, or
                  trainer substitutions require a human click in the staging queue. No automated
                  runaway messages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE ROI CALCULATOR & PROOF */}
        <section id="roi" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#e5eeff] shadow-lg">
              <div className="flex items-center justify-between pb-6 border-b border-[#e5eeff]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4b41e1] flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Campus Yield Simulator
                  </div>
                  <h3 className="font-extrabold text-xl text-[#091426] mt-1">
                    Calculate Operational Yield
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#e5eeff] text-xs font-mono font-bold text-[#091426]">
                  Model v3.2
                </span>
              </div>

              <div className="space-y-6 my-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#091426] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#4b41e1]" /> Active Enrolled Students
                    </span>
                    <span className="font-mono text-[#4b41e1] bg-[#eff4ff] px-2 py-0.5 rounded font-bold">
                      {studentsCount.toLocaleString()} Students
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="50"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(parseInt(e.target.value, 10))}
                    className="w-full accent-[#4b41e1] h-2 bg-[#e5eeff] rounded-lg cursor-pointer transition-all"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#45474c] mt-1.5">
                    <span>100</span>
                    <span>2,000</span>
                    <span>4,000+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#091426] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#4b41e1]" /> Active Concurrent Batches
                    </span>
                    <span className="font-mono text-[#4b41e1] bg-[#eff4ff] px-2 py-0.5 rounded font-bold">
                      {batchesCount} Batches
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="80"
                    step="2"
                    value={batchesCount}
                    onChange={(e) => setBatchesCount(parseInt(e.target.value, 10))}
                    className="w-full accent-[#4b41e1] h-2 bg-[#e5eeff] rounded-lg cursor-pointer transition-all"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#45474c] mt-1.5">
                    <span>4</span>
                    <span>40</span>
                    <span>80+</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#e5eeff] text-center">
                <div className="p-4 rounded-xl bg-[#eff4ff]">
                  <div className="text-xl sm:text-2xl font-black text-[#091426]">
                    {calculatedHours} hrs
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#45474c] font-medium mt-1">
                    Saved / Coordinator / Wk
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#eff4ff]">
                  <div className="text-xl sm:text-2xl font-black text-[#00a472]">
                    ₹{calculatedRevenue}L
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#45474c] font-medium mt-1">
                    Dropout Fees Protected
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#eff4ff]">
                  <div className="text-xl sm:text-2xl font-black text-[#4b41e1]">0</div>
                  <div className="text-[10px] sm:text-xs text-[#45474c] font-medium mt-1">
                    Timetable Overlaps
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5eeff] shadow-md">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#091426] leading-relaxed italic">
                  "Before EduPulse, a trainer calling sick on Monday morning caused 4 hours of
                  timetable panic across labs and Zoom links. Now the copilot synthesizes a
                  conflict-free swap in 1.4 seconds and drafts student WhatsApp notices for
                  review."
                </p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#e5eeff]">
                  <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    AS
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#091426]">Ananya Sharma</div>
                    <div className="text-[11px] text-[#45474c]">
                      Operations Director • Coach Sphere
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#00a472]" />
                  <span className="text-xs font-bold text-[#091426]">
                    ISO 27001 & SOC-2 Compliant
                  </span>
                </div>
                <span className="text-xs font-mono text-[#4b41e1] font-semibold bg-white px-2 py-0.5 rounded border border-[#e5eeff]">
                  DPDP Ready
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Footer */}
      <footer className="mt-16 bg-white border-t border-[#e5eeff]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#091426] flex items-center justify-center text-white font-bold text-xs">
              E
            </div>
            <span className="font-extrabold text-sm text-[#091426]">CodeSphere.AI</span>
            <span className="text-xs text-[#45474c]">Powered by Coach Sphere</span>
          </div>
          <div className="text-xs text-[#45474c] text-center md:text-right">
            © 2026 CodeSphere.AI. Deterministic Academic Operations Runtime. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}