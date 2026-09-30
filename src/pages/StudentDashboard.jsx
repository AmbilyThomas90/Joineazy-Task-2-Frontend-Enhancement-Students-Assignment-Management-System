import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/mockApi';
import Navbar from '../components/Navbar';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    api.getCoursesForUser(user.id, 'student').then(setCourses);
  }, [user.id]);

  return (
<div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink">Your courses</h1>
          <p className="text-sm text-slate mt-1">This semester's enrolled courses.</p>
        </div>

        {courses === null && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-5 animate-pulse h-32" />
            ))}
          </div>
        )}

        {courses && courses.length === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-ink font-medium mb-1">No courses yet</p>
            <p className="text-sm text-slate">Courses you're enrolled in will appear here.</p>
          </div>
        )}

        {courses && courses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/student/courses/${c.id}`}
                className="group rounded-xl border border-line bg-surface p-5 hover:border-ink/40 hover:shadow-sm transition-all"
              >
                <div className="text-xs font-semibold text-amber tracking-wide mb-2">{c.code} · {c.semester}</div>
                <h2 className="font-display text-lg text-ink mb-4 leading-snug">{c.name}</h2>
                <div className="text-xs text-slate">{c.assignmentCount} assignments</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
