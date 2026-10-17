import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  Laptop,
  Terminal,
  Activity,
  GitBranch,
  GitCommit,
  Wifi,
  Server,
  Layers,
  Filter,
  Search,
  RefreshCw,
  Download,
  ShieldCheck,
  Bug,
  Send,
  Radio,
  FileCode2
} from 'lucide-react';

export default function TutorDesk({ onShowToast = () => {} }) {
  const [logFilter, setLogFilter] = useState('all'); // 'all' | 'git' | 'system' | 'attendance'
  const [logSearch, setLogSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Real-Time Console Activity Feed
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 'LOG-8841',
      timestamp: '11:14:22 AM',
      category: 'git',
      severity: 'success',
      actor: 'Tanvi Patel (PC-02)',
      message: 'Git push to feature/jwt-filter on branch jfs-04/tanvi-auth. Build passing (4/4 tests).',
      detail: 'commit 4a9f1b2'
    },
    {
      id: 'LOG-8840',
      timestamp: '11:12:08 AM',
      category: 'system',
      severity: 'error',
      actor: 'Arjun Nair (PC-22)',
      message: 'Docker daemon crash on workstation: exit status 137 (OOM killed during Mongo replica init).',
      detail: 'Container exited'
    },
    {
      id: 'LOG-8839',
      timestamp: '11:08:50 AM',
      category: 'attendance',
      severity: 'info',
      actor: 'Aditya Joshi (PC-28)',
      message: 'Ingress handshake: Door RFID biometric verified + local subnet match (192.168.3.128).',
      detail: 'Physical kiosk'
    },
    {
      id: 'LOG-8838',
      timestamp: '11:04:15 AM',
      category: 'git',
      severity: 'warning',
      actor: 'Rahul Verma (PC-14)',
      message: 'Uncommitted changes detected (>14 files modified, no remote PR staged in last 72 hours).',
      detail: 'Git divergence'
    },
    {
      id: 'LOG-8837',
      timestamp: '10:58:32 AM',
      category: 'system',
      severity: 'info',
      actor: 'Dual-Stream Cluster',
      message: 'Zoom bridge re-established: HD screen capture sync nominal at 60 fps (Latency: 28ms).',
      detail: 'Cluster node 02'
    },
    {
      id: 'LOG-8836',
      timestamp: '10:52:19 AM',
      category: 'attendance',
      severity: 'warning',
      actor: 'Sneha Kulkarni (PC-09)',
      message: 'Zoom audio drop detected: packet loss spiked to 14.2% on cellular backup fallback.',
      detail: 'Network latency'
    }
  ]);

  // Live Student Workstation Sprint Status
  const [workstationRoster] = useState([
    {
      terminal: 'PC-02',
      student: 'Tanvi Patel',
      branch: 'feature/jwt-filter',
      dockerStatus: 'Running (3 containers)',
      cpuLoad: '18%',
      lastAction: 'Pushed commit 4a9f1b2',
      status: 'nominal'
    },
    {
      terminal: 'PC-09',
      student: 'Sneha Kulkarni',
      branch: 'feature/redis-token-blacklist',
      dockerStatus: 'Running (2 containers)',
      cpuLoad: '32%',
      lastAction: 'Running Maven test suite',
      status: 'nominal'
    },
    {
      terminal: 'PC-14',
      student: 'Rahul Verma',
      branch: 'main (stale by 8 commits)',
      dockerStatus: 'Stopped',
      cpuLoad: '2%',
      lastAction: 'No activity in 42 mins',
      status: 'stalled'
    },
    {
      terminal: 'PC-22',
      student: 'Arjun Nair',
      branch: 'fix/docker-network',
      dockerStatus: 'Crash Loop BackOff',
      cpuLoad: '89%',
      lastAction: 'OOM during DB migration',
      status: 'error'
    },
    {
      terminal: 'PC-28',
      student: 'Aditya Joshi',
      branch: 'feature/kafka-producer',
      dockerStatus: 'Running (4 containers)',
      cpuLoad: '45%',
      lastAction: 'Compiling Spring Boot jar',
      status: 'nominal'
    }
  ]);

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Refreshed lab telemetry: 28 terminals active, Docker daemon sync 100%.');
    }, 600);
  };

  const filteredLogs = systemLogs.filter((log) => {
    const matchesFilter = logFilter === 'all' || log.category === logFilter;
    const matchesSearch =
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      {/* 1. Tutor Overview Header */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Faculty Teaching Deck</h2>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Session Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned to: <strong className="text-slate-800">Prof. Rajiv Kumar</strong> (Lead Java Faculty) • Workload: 4.5h / 6.0h Daily Cap • Sandbox Level 2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Sync Lab State</span>
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Lab 03 Core reservation extended by 30 mins for Q&A.')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Extend Lab 03 Slot</span>
          </button>
        </div>
      </section>

      {/* 2. Key Pedagogical & System Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Sessions</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">2 Batches</span>
            <span className="text-xs text-indigo-600 font-semibold">Java FS & Spring</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Next up: 11:30 AM (Lab 03 Core)</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In-Seat Attendance</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600">92.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">+1.8% vs last wk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">62 of 67 registered learners verified</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unreviewed Git PRs</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600">5 PRs</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
              Action Req
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Sprint 3 JWT Filter implementations</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Syllabus Pacing</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">Module 6 / 8</span>
            <span className="text-xs text-emerald-600 font-semibold">On Schedule</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full w-[75%]" />
          </div>
        </div>
      </section>

      {/* 3. Live Cohort Details & Ingress Infrastructure */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Current Cohort: Java Full Stack (JFS-04)</h3>
            <p className="text-xs text-slate-500">Sprint 3: Microservice Containerization, Redis Blacklist & JWT Auth</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session: Lab 03 Core (Terminal Subnet 192.168.3.0/24)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block mb-1">Session Materials</span>
                <FileCode2 className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs text-slate-500">Spring Security 6.2 FilterChain & MockMvc integration tests repository</p>
              <div className="mt-2 text-[11px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200 truncate">
                git clone github.com/tst-cohort-jfs/sprint-3-jwt
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Broadcasted repository link to student lab terminals.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Broadcast Git Repo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block mb-1">Dual Stream Zoom</span>
                <Video className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">6 Remote participants connected via cloud relay server</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>1080p 60fps • 4.8 Mbps • 0% Packet Loss</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Audio & Screen share sync verified across all nodes.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Verify Stream Health</span>
              <Wifi className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block mb-1">Lab Workstations</span>
                <Server className="w-4 h-4 text-slate-700" />
              </div>
              <p className="text-xs text-slate-500">28 Physical terminals active in Lab 03 • 26 Healthy, 1 Error, 1 Idle</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-600">
                <span className="text-emerald-700 font-bold">26 OK</span>
                <span>•</span>
                <span className="text-rose-700 font-bold">1 Crash (PC-22)</span>
                <span>•</span>
                <span className="text-amber-700 font-bold">1 Stalled (PC-14)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Terminals pinged: 27 of 28 Docker daemons responsive.')}
              className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Ping Workstations</span>
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Active Student Lab Progress Matrix (Live Terminal Telemetry) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Workstation Container & Git Progress Matrix</h3>
            <span className="text-[11px] text-slate-400 font-mono">({workstationRoster.length} active monitors)</span>
          </div>
          <span className="text-xs text-slate-400">Polling rate: 5s intervals</span>
        </div>

        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3 rounded-l-lg">Terminal</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Active Branch</th>
                <th className="py-2.5 px-3">Docker Container State</th>
                <th className="py-2.5 px-3">CPU / Load</th>
                <th className="py-2.5 px-3">Last Verified Event</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {workstationRoster.map((item) => {
                const isError = item.status === 'error';
                const isStalled = item.status === 'stalled';

                return (
                  <tr key={item.terminal} className="hover:bg-slate-50/80 transition-colors font-sans">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.terminal}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.student}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {item.branch}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isError
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isStalled
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isError ? 'bg-rose-600' : isStalled ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        {item.dockerStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.cpuLoad}</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{item.lastAction}</td>
                    <td className="py-3 px-3 text-right">
                      {isError ? (
                        <button
                          type="button"
                          onClick={() => onShowToast(`Dispatched terminal reset command to ${item.terminal}.`)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Bug className="w-3 h-3" />
                          <span>Restart Container</span>
                        </button>
                      ) : isStalled ? (
                        <button
                          type="button"
                          onClick={() => onShowToast(`Sent mentor check-in prompt to ${item.student}'s screen.`)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Nudge Screen</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onShowToast(`Inspected terminal session of ${item.student}.`)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Inspect</span>
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

      {/* 5. Real-Time Pedagogical Activity Logs Console */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Real-Time Ingress & Pedagogical Event Stream</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-bold">
                {filteredLogs.length} events
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit stream capturing biometric scans, remote packet health, and student git commit hooks.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search actor, commit, log..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Event Category:</span>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'git', label: 'Git & Builds' },
            { id: 'system', label: 'Workstations & Containers' },
            { id: 'attendance', label: 'Kiosks & RFID' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setLogFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                logFilter === f.id ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Log Terminal Window */}
        <div className="rounded-xl bg-[#091426] text-white p-4 font-mono text-xs space-y-2 max-h-80 overflow-y-auto border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>TIMESTAMP / EVENT ID</span>
            <span>SYSTEM AUDIT LEVEL: 2 (FEE-BLIND PEDAGOGICAL DECK)</span>
          </div>

          <div className="space-y-2 pt-1">
            {filteredLogs.map((log) => {
              const isError = log.severity === 'error';
              const isWarning = log.severity === 'warning';
              const isSuccess = log.severity === 'success';

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 transition-colors border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        isError
                          ? 'bg-rose-500 animate-pulse'
                          : isWarning
                          ? 'bg-amber-400'
                          : isSuccess
                          ? 'bg-emerald-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-bold">{log.timestamp}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                          {log.id}
                        </span>
                        <span className="text-[11px] text-indigo-300 font-semibold">{log.actor}</span>
                      </div>
                      <p className="text-slate-200 text-xs mt-1 leading-relaxed">{log.message}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded self-start shrink-0">
                    {log.detail}
                  </span>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="py-6 text-center text-slate-500 text-xs">
                No telemetry logs matching query "{logSearch}".
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}