import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../api/mockApi';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import { useToast } from '../context/ToastContext';

const emptyForm = { title: '', description: '', deadline: '', link: '', submissionType: 'individual' };
// Professor Assignments page component.
export default function ProfessorAssignments() {
  const { courseId } = useParams();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCourse(courseId).then(setCourse);
    refresh();
  }, [courseId]);

  function refresh() {
    api.getAssignmentsForCourse(courseId).then(setAssignments);
  }
// Filter assignments based on:
  // 1. Search text
  // 2. Submission status
  const filtered = useMemo(() => {
    if (!assignments) return null;
    return assignments.filter((a) => {
      const matchesQuery = a.title.toLowerCase().includes(query.toLowerCase());
      if (!matchesQuery) return false;
      if (statusFilter === 'all') return true;
      const complete = a.totalUnits > 0 && a.submittedUnits === a.totalUnits;
      if (statusFilter === 'complete') return complete;
      if (statusFilter === 'incomplete') return !complete;
      return true;
    });
  }, [assignments, query, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(a) {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description,
      deadline: a.deadline.slice(0, 16),
      link: a.link,
      submissionType: a.submissionType,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.deadline || !form.link) {
      showToast('Fill in title, deadline and the submission link.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updateAssignment(editing.id, form);
        showToast('Assignment updated.');
      } else {
        await api.createAssignment(courseId, form);
        showToast('Assignment created.');
      }
      setModalOpen(false);
      refresh();
    } catch {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/professor" className="text-sm text-slate hover:text-ink mb-4 inline-block">← All courses</Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-amber tracking-wide mb-1">{course?.code}</div>
            <h1 className="font-display text-3xl text-ink">{course?.name || 'Loading…'}</h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-ink text-paper rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-ink-light transition-colors"
          >
            + New assignment
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments…"
            className="flex-1 min-w-[200px] rounded-md border border-line bg-surface px-3 py-2 text-sm placeholder:text-slate/60 focus:border-ink transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm focus:border-ink transition-colors"
          >
            <option value="all">All statuses</option>
            <option value="complete">Fully submitted</option>
            <option value="incomplete">Still pending</option>
          </select>
        </div>

        {filtered === null && <p className="text-sm text-slate">Loading assignments…</p>}
        {filtered && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-ink font-medium mb-1">No assignments found</p>
            <p className="text-sm text-slate">Try a different search, or create your first assignment.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered && filtered.map((a) => (
            <div key={a.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-display text-lg text-ink">{a.title}</h3>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate bg-line/40 rounded-full px-2 py-0.5">
                      {a.submissionType}
                    </span>
                  </div>
                  <p className="text-sm text-slate mb-3 max-w-xl">{a.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate">
                    <span>Due {formatDate(a.deadline)}</span>
                    <a href={a.link} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-2">
                      Submission folder
                    </a>
                    <button onClick={() => openEdit(a)} className="text-ink underline underline-offset-2">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <ProgressBar value={a.submittedUnits} total={a.totalUnits} label={`${a.unitLabel} submitted`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalOpen && (
        <AssignmentModal
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
          isEditing={!!editing}
        />
      )}
    </div>
  );
}

function AssignmentModal({ form, setForm, onClose, onSave, saving, isEditing }) {
  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-surface border border-line shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-xl text-ink mb-5">{isEditing ? 'Edit assignment' : 'New assignment'}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Title</label>
            <input value={form.title} onChange={set('title')} className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-ink" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-ink" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Deadline</label>
              <input type="datetime-local" value={form.deadline} onChange={set('deadline')} className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-ink" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Submission type</label>
              <select value={form.submissionType} onChange={set('submissionType')} className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-ink">
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">OneDrive link</label>
            <input value={form.link} onChange={set('link')} placeholder="https://onedrive.live.com/…" className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-ink" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate hover:text-ink">Cancel</button>
            <button type="submit" disabled={saving} className="bg-ink text-paper rounded-md px-4 py-2 text-sm font-semibold hover:bg-ink-light disabled:opacity-60">
              {saving ? 'Saving…' : 'Save assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
