import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/mockApi';
import Navbar from '../components/Navbar';

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    api.getCoursesForUser(user.id, 'professor').then(setCourses);
  }, [user.id]);

  return (
   <div className="min-h-screen bg-[#0B1F3A]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-white">Your courses</h1>
          <p className="text-sm text-slate mt-1">Select a course to manage its assignments.</p>
        </div>

        {courses === null && <SkeletonGrid />}

        {courses && courses.length === 0 && (
          <EmptyState />
        )}

        {courses && courses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/professor/courses/${c.id}`}
                className="group rounded-xl border border-line bg-surface p-5 hover:border-ink/40 hover:shadow-sm transition-all"
              >
                <div className="text-xs font-semibold text-amber tracking-wide mb-2">{c.code} · {c.semester}</div>
                <h2 className="font-display text-lg text-ink mb-4 leading-snug">{c.name}</h2>
                <div className="flex items-center gap-4 text-xs text-slate">
                  <span>{c.studentCount} students</span>
                  <span>·</span>
                  <span>{c.assignmentCount} assignments</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-line bg-surface p-5 animate-pulse">
          <div className="h-3 w-24 bg-line/60 rounded mb-3" />
          <div className="h-5 w-40 bg-line/60 rounded mb-6" />
          <div className="h-3 w-32 bg-line/40 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
      <p className="text-ink font-medium mb-1">No courses yet</p>
      <p className="text-sm text-slate">Courses you teach will show up here once assigned.</p>
    </div>
  );
}
