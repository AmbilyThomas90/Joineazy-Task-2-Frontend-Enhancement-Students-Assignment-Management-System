import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/mockApi';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
// STUDENT ASSIGNMENTS PAGE
export default function StudentAssignments() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [acking, setAcking] = useState(null);

  // REFRESH ASSIGNMENTS
  const refresh = useCallback(() => {
    api.getStudentAssignmentView(courseId, user.id).then(setAssignments);
  }, [courseId, user.id]);

 // LOAD COURSE AND ASSIGNMENTS

  useEffect(() => {
    api.getCourse(courseId).then(setCourse);
    refresh();
  }, [courseId, refresh]);
  
  // HANDLE ASSIGNMENT ACKNOWLEDGEMENT
  async function handleAcknowledge(a) {
    setAcking(a.id);
    try {
      if (a.submissionType === 'individual') {
        await api.acknowledgeIndividual(a.id, user.id);
      } else {
        const group = await api.getMyGroupForCourse(courseId, user.id);
        await api.acknowledgeAsGroupLeader(a.id, group.id, user.id);
      }
      showToast('Marked as submitted. Nice work!');
      refresh();
    } catch (err) {
      showToast(err.message || 'Could not update status.', 'error');
    } finally {
      setAcking(null);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/student" className="text-sm text-slate hover:text-ink mb-4 inline-block">← All courses</Link>

        <div className="mb-8">
          <div className="text-xs font-semibold text-amber tracking-wide mb-1">{course?.code}</div>
          <h1 className="font-display text-3xl text-ink">{course?.name || 'Loading…'}</h1>
        </div>

        {assignments === null && <p className="text-sm text-slate">Loading assignments…</p>}
        {assignments && assignments.length === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-ink font-medium mb-1">Nothing here yet</p>
            <p className="text-sm text-slate">Assignments for this course will show up here.</p>
          </div>
        )}

        <div className="space-y-4">
          {assignments && assignments.map((a) => (
            <AssignmentCard key={a.id} a={a} onAcknowledge={() => handleAcknowledge(a)} busy={acking === a.id} />
          ))}
        </div>
      </main>
    </div>
  );
}

function AssignmentCard({ a, onAcknowledge, busy }) {
  const overdue = new Date(a.deadline) < new Date() && a.myStatus !== 'acknowledged';

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-lg text-ink">{a.title}</h3>
        <StatusBadge status={a.myStatus} />
      </div>
      <p className="text-sm text-slate mb-4 max-w-xl">{a.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate mb-4">
        <span className={overdue ? 'text-rust font-medium' : ''}>Due {formatDate(a.deadline)}</span>
        <span>·</span>
        <span className="capitalize">{a.submissionType}{a.groupName ? ` — ${a.groupName}` : ''}</span>
        <span>·</span>
        <a href={a.link} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-2">
          Open submission folder
        </a>
      </div>

      {a.submissionType === 'group' && !a.inGroup && (
        <p className="text-sm text-rust bg-rust-light rounded-md px-3 py-2.5">
          You are not part of any group. Form or join one to submit this assignment.
        </p>
      )}

      {a.inGroup && a.myStatus !== 'acknowledged' && a.submissionType === 'individual' && (
        <button
          onClick={onAcknowledge}
          disabled={busy}
          className="bg-ink text-paper rounded-md px-4 py-2 text-sm font-semibold hover:bg-ink-light transition-colors disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Yes, I have submitted'}
        </button>
      )}

      {a.inGroup && a.submissionType === 'group' && a.myStatus !== 'acknowledged' && (
        a.isGroupLeader ? (
          <button
            onClick={onAcknowledge}
            disabled={busy}
            className="bg-ink text-paper rounded-md px-4 py-2 text-sm font-semibold hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Yes, our group has submitted'}
          </button>
        ) : (
          <p className="text-sm text-slate italic">Waiting on your group leader to confirm submission.</p>
        )
      )}

      {a.myStatus === 'acknowledged' && a.ackTimestamp && (
        <p className="text-xs text-slate">Confirmed on {formatDate(a.ackTimestamp)}</p>
      )}
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
