import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  FlaskConical,
  Plus,
  RefreshCw,
  Video
} from 'lucide-react';
import { apiRequest } from '../api/client';

const formatDate = (date) => date.toISOString().slice(0, 10);
const today = () => formatDate(new Date());
const nextWeek = () => formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

const emptySchedule = {
  branch_id: '',
  batch_id: '',
  trainer_id: '',
  day_of_week: '1',
  start_time: '09:00',
  end_time: '11:00',
  mode: 'CLASSROOM',
  room_number: '',
  meeting_url: '',
  effective_from: today(),
  effective_until: ''
};

const normalizeList = (body) => {
  if (Array.isArray(body)) return body;
  return body?.timetable || body?.sessions || body?.schedules || body?.data || [];
};

const normalizeSession = (session) => ({
  id: session.id || session.session_id,
  batch: session.batch_name || session.batch?.name || session.batch || 'Unnamed batch',
  trainer: session.trainer_name || session.trainer?.name || session.trainer || 'Unassigned',
  date: session.session_date || session.date || '',
  startTime: session.start_time || '',
  endTime: session.end_time || '',
  room: session.room_number || session.room || 'Room not set',
  mode: String(session.mode || 'CLASSROOM').toUpperCase(),
  meetingUrl: session.meeting_url || '',
  practical: Boolean(session.is_practical || session.session_type === 'PRACTICAL'),
  practicalHours: Number(session.practical_hours || 0),
  status: String(session.status || 'ACTIVE').toUpperCase()
});

export default function TimetableRescheduler({ onShowToast = () => {} }) {
  const [branchId, setBranchId] = useState('');
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(nextWeek);
  const [sessions, setSessions] = useState([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [rescheduleState, setRescheduleState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTimetable = useCallback(async () => {
    if (!branchId.trim()) {
      setError('Enter a branch ID to load its timetable.');
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      const result = await apiRequest(
        `/api/admin/branches/${encodeURIComponent(branchId.trim())}/timetable?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`
      );
      setSessions(normalizeList(result).map(normalizeSession));
    } catch (requestError) {
      setError(requestError.message || 'Unable to load the branch timetable.');
    } finally {
      setIsLoading(false);
    }
  }, [branchId, fromDate, toDate]);

  useEffect(() => {
    if (branchId.trim()) {
      loadTimetable();
    }
  }, [branchId, loadTimetable]);

  const practicalHours = useMemo(
    () => sessions.reduce((total, session) => total + session.practicalHours, 0),
    [sessions]
  );

  const updateScheduleField = (field, value) => {
    setScheduleForm((current) => ({ ...current, [field]: value }));
  };

  const createSchedule = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setError('');
    setNotice('');

    const payload = {
      ...scheduleForm,
      branch_id: scheduleForm.branch_id.trim(),
      batch_id: scheduleForm.batch_id.trim(),
      trainer_id: scheduleForm.trainer_id.trim() || null,
      room_number: scheduleForm.room_number.trim() || null,
      meeting_url: scheduleForm.meeting_url.trim() || null,
      effective_until: scheduleForm.effective_until || null,
      day_of_week: Number(scheduleForm.day_of_week),
      start_time: `${scheduleForm.start_time}:00`,
      end_time: `${scheduleForm.end_time}:00`
    };

    try {
      await apiRequest('/api/admin/schedules', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setBranchId(payload.branch_id);
      setNotice('Recurring schedule created successfully.');
      onShowToast('Schedule created successfully.');
      setScheduleForm((current) => ({ ...emptySchedule, branch_id: current.branch_id }));
      await loadTimetable();
    } catch (requestError) {
      setError(requestError.message || 'Unable to create the schedule.');
    } finally {
      setIsCreating(false);
    }
  };

  const rescheduleSession = async (session) => {
    if (!session.id) {
      setError('This timetable entry does not include a session ID.');
      return;
    }

    const nextDate = window.prompt('New session date (YYYY-MM-DD)', session.date || fromDate);
    if (!nextDate) return;
    const startTime = window.prompt('New start time (HH:MM)', session.startTime?.slice(0, 5) || '09:00');
    if (!startTime) return;
    const endTime = window.prompt('New end time (HH:MM)', session.endTime?.slice(0, 5) || '11:00');
    if (!endTime) return;
    const reason = window.prompt('Reason for rescheduling');
    if (!reason?.trim()) return;

    setRescheduleState((current) => ({ ...current, [session.id]: 'loading' }));
    setError('');

    try {
      await apiRequest(`/api/admin/class-sessions/${encodeURIComponent(session.id)}/reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({
          session_date: nextDate,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          room_number: session.room === 'Room not set' ? null : session.room,
          meeting_url: session.meetingUrl || null,
          reason: reason.trim()
        })
      });
      setRescheduleState((current) => ({ ...current, [session.id]: 'success' }));
      onShowToast('Class session rescheduled successfully.');
      await loadTimetable();
    } catch (requestError) {
      setRescheduleState((current) => ({ ...current, [session.id]: 'error' }));
      setError(requestError.message || 'Unable to reschedule the class session.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Daily Schedule Manager</h2>
              <p className="mt-1 text-xs text-slate-500">
                Create recurring classes and reschedule individual sessions for a branch.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
              placeholder="Branch ID"
              className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-400"
            />
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400"
            />
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={loadTimetable}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Load timetable
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div><p className="font-semibold">Scheduler request failed</p><p className="mt-1 text-xs">{error}</p></div>
        </div>
      )}
      {notice && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-semibold">{notice}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Plus className="h-4 w-4 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Create recurring schedule</h3>
            <p className="mt-1 text-xs text-slate-500">Uses the backend ScheduleCreateRequest schema.</p>
          </div>
        </div>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={createSchedule}>
          <Field label="Branch ID" value={scheduleForm.branch_id} onChange={(value) => updateScheduleField('branch_id', value)} required />
          <Field label="Batch ID" value={scheduleForm.batch_id} onChange={(value) => updateScheduleField('batch_id', value)} required />
          <Field label="Trainer ID" value={scheduleForm.trainer_id} onChange={(value) => updateScheduleField('trainer_id', value)} />
          <SelectField label="Day" value={scheduleForm.day_of_week} onChange={(value) => updateScheduleField('day_of_week', value)} options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((label, value) => ({ label, value: String(value) }))} />
          <Field label="Start time" type="time" value={scheduleForm.start_time} onChange={(value) => updateScheduleField('start_time', value)} required />
          <Field label="End time" type="time" value={scheduleForm.end_time} onChange={(value) => updateScheduleField('end_time', value)} required />
          <SelectField label="Mode" value={scheduleForm.mode} onChange={(value) => updateScheduleField('mode', value)} options={['CLASSROOM', 'ONLINE', 'HYBRID'].map((label) => ({ label, value: label }))} />
          <Field label="Room number" value={scheduleForm.room_number} onChange={(value) => updateScheduleField('room_number', value)} />
          <Field label="Meeting URL" value={scheduleForm.meeting_url} onChange={(value) => updateScheduleField('meeting_url', value)} />
          <Field label="Effective from" type="date" value={scheduleForm.effective_from} onChange={(value) => updateScheduleField('effective_from', value)} required />
          <Field label="Effective until" type="date" value={scheduleForm.effective_until} onChange={(value) => updateScheduleField('effective_until', value)} />
          <div className="flex items-end">
            <button type="submit" disabled={isCreating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
              <Plus className="h-4 w-4" /> {isCreating ? 'Creating...' : 'Create schedule'}
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Sessions" value={sessions.length} icon={CalendarDays} />
        <MetricCard label="Practical hours" value={`${practicalHours}h`} icon={FlaskConical} />
        <MetricCard label="Date range" value={`${fromDate} → ${toDate}`} icon={Clock} />
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <div><h3 className="text-sm font-bold text-slate-900">Branch timetable</h3><p className="mt-1 text-xs text-slate-500">Sessions returned by the backend</p></div>
          <span className="text-xs font-semibold text-slate-500">{sessions.length} sessions</span>
        </div>
        {isLoading ? <LoadingState /> : sessions.length === 0 ? <p className="py-10 text-center text-xs text-slate-500">Enter a branch ID and load a date range.</p> : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{session.batch}</span>
                      {session.practical && <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700"><FlaskConical className="h-3 w-3" /> Practical · {session.practicalHours}h</span>}
                      {(session.mode === 'ONLINE' || session.mode === 'HYBRID') && <Video className="h-3.5 w-3.5 text-indigo-500" />}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span><CalendarDays className="mr-1 inline h-3.5 w-3.5" />{session.date}</span>
                      <span><Clock className="mr-1 inline h-3.5 w-3.5" />{session.startTime} - {session.endTime}</span>
                      <span>{session.room}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left md:text-right"><p className="text-[10px] font-bold uppercase text-slate-400">Trainer</p><p className="text-xs font-bold text-slate-900">{session.trainer}</p></div>
                    <button type="button" onClick={() => rescheduleSession(session)} disabled={rescheduleState[session.id] === 'loading'} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                      {rescheduleState[session.id] === 'loading' ? 'Saving...' : 'Reschedule'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">{label}{required && <span className="text-rose-500">*</span>}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-indigo-400" /></label>;
}

function SelectField({ label, value, onChange, options }) {
  return <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-indigo-400">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function MetricCard({ label, value, icon: Icon }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{label}</span><Icon className="h-4 w-4 text-indigo-500" /></div><p className="mt-3 truncate text-xl font-bold text-slate-900">{value}</p></div>;
}

function LoadingState() {
  return <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-500"><RefreshCw className="h-4 w-4 animate-spin" /> Loading timetable...</div>;
}
