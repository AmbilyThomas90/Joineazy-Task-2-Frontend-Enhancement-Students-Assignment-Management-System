import { Link, useNavigate } from 'react-router-dom';  // Import Link for navigation 
import { useAuth } from '../context/AuthContext';

export default function Navbar() {   //the logged-in user and logout function
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight text-ink">
          Coursework
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-sm font-medium text-ink">{user.name}</div>
              <div className="text-xs text-slate capitalize">{user.role}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-semibold font-display">
              {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate hover:text-ink transition-colors border border-line rounded-md px-3 py-1.5"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
