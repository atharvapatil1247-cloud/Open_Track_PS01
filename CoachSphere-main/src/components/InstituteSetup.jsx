import React, { useState } from 'react';
import { BookOpen, Building2, Layers3, Loader2, Plus } from 'lucide-react';
import { apiRequest } from '../api/client';

const resourceDefinitions = {
  branch: {
    label: 'Branch',
    endpoint: '/api/admin/branches',
    icon: Building2,
    fields: [
      ['name', 'Branch name', 'e.g. Pune Central', 'text', true],
      ['address', 'Address', 'e.g. Baner Road, Pune', 'text', false],
      ['phone', 'Contact phone', '+91 98765 43210', 'tel', false],
    ],
  },
  course: {
    label: 'Course',
    endpoint: '/api/admin/courses',
    icon: BookOpen,
    fields: [
      ['course_code', 'Course code', 'e.g. JFS-04', 'text', true],
      ['name', 'Course name', 'e.g. Java Full Stack', 'text', true],
      ['duration_weeks', 'Duration (weeks)', 'e.g. 24', 'number', true],
      ['base_fee', 'Base fee', 'e.g. 75000', 'number', true],
    ],
  },
  batch: {
    label: 'Batch',
    endpoint: '/api/admin/batches',
    icon: Layers3,
    fields: [
      ['name', 'Batch name', 'e.g. JFS Morning October 2026', 'text', true],
      ['course_id', 'Course ID', 'UUID of the course', 'text', true],
      ['mode', 'Mode', 'e.g. hybrid, online, classroom', 'text', true],
      ['start_date', 'Start date', '', 'date', true],
      ['end_date', 'End date', '', 'date', false],
      ['schedule_time', 'Schedule time', '', 'time', true],
      ['trainer_id', 'Trainer ID', 'UUID of the trainer', 'text', false],
      ['room_number', 'Room number', 'e.g. Lab 03', 'text', false],
      ['meeting_url', 'Meeting URL', 'https://...', 'url', false],
      ['max_classroom_seats', 'Classroom seats', '30', 'number', false],
      ['max_online_seats', 'Online seats', '100', 'number', false],
    ],
  },
};

const initialValues = {
  branch: { name: '', address: '', phone: '' },
  course: { course_code: '', name: '', duration_weeks: '', base_fee: '' },
  batch: {
    name: '',
    course_id: '',
    mode: 'hybrid',
    start_date: '',
    end_date: '',
    schedule_time: '',
    trainer_id: '',
    room_number: '',
    meeting_url: '',
    max_classroom_seats: '30',
    max_online_seats: '100',
  },
};

export default function InstituteSetup({ onShowToast = () => {} }) {
  const [resourceType, setResourceType] = useState('branch');
  const [values, setValues] = useState(initialValues.branch);
  const [createdResource, setCreatedResource] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const definition = resourceDefinitions[resourceType];
  const Icon = definition.icon;

  const selectResource = (type) => {
    setResourceType(type);
    setValues(initialValues[type]);
    setCreatedResource(null);
  };

  const updateValue = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const buildPayload = () => {
    const payload = {};
    definition.fields.forEach(([name]) => {
      const value = values[name];
      if (value === '' || value === undefined) return;
      if (['duration_weeks', 'max_classroom_seats', 'max_online_seats'].includes(name)) {
        payload[name] = Number(value);
      } else if (name === 'base_fee') {
        payload[name] = Number(value);
      } else {
        payload[name] = value.trim();
      }
    });
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setCreatedResource(null);

    try {
      const response = await apiRequest(definition.endpoint, {
        method: 'POST',
        body: JSON.stringify(buildPayload()),
      });
      setCreatedResource(response);
      onShowToast(`${definition.label} created successfully.`);
      setValues(initialValues[resourceType]);
    } catch (error) {
      onShowToast(error.message || `${definition.label} creation failed.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Institute setup</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Create branches, courses, and batches directly in your institute.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {Object.entries(resourceDefinitions).map(([type, item]) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => selectResource(type)}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold transition-colors ${
                  resourceType === type
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                Create {item.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {definition.fields.map(([name, label, placeholder, type, required]) => (
            <label key={name}>
              <span className="mb-1 block text-xs font-semibold text-slate-700">
                {label}
                {required && <span className="ml-1 text-rose-600">*</span>}
              </span>
              <input
                name={name}
                value={values[name]}
                onChange={updateValue}
                placeholder={placeholder}
                required={required}
                type={type}
                min={type === 'number' ? '0' : undefined}
                step={name === 'base_fee' ? '0.01' : type === 'number' ? '1' : undefined}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isSubmitting ? `Creating ${definition.label.toLowerCase()}...` : `Create ${definition.label}`}
          </button>
        </form>
      </section>

      {createdResource && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
          <h3 className="text-sm font-bold text-emerald-900">{definition.label} created</h3>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-white p-3 text-xs text-slate-700">
            {JSON.stringify(createdResource, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
