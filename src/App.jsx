import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import RoleRedirect from './pages/RoleRedirect';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ProfessorAssignments from './pages/ProfessorAssignments';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssignments from './pages/StudentAssignments';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* ================================
                PUBLIC ROUTES
                ================================= */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />  {/* Registration page */}
            {/* 
              
              RoleRedirect checks the user's role and
              redirects them to the appropriate dashboard.
            */}
            <Route path="/" element={<RoleRedirect />} />
            {/* ================================
                PROFESSOR ROUTES
            ================================= */}
            <Route
              path="/professor"
              element={<ProtectedRoute role="professor"><ProfessorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/professor/courses/:courseId"
              element={<ProtectedRoute role="professor"><ProfessorAssignments /></ProtectedRoute>}
            />
            {/* ================================
                STUDENT ROUTES
            ================================= */}
            <Route
              path="/student"
              element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
            />
            <Route
              path="/student/courses/:courseId"
              element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>}
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
