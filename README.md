# Coursework — Student, Group & Assignment Management (Frontend)

A React + Tailwind CSS frontend for a professor/student assignment workflow: professors create and track assignments per course, students acknowledge individual or group submissions, and progress is visualized in real time.

This round is frontend-only. It ships with a **mock API layer** (`src/api/`) that simulates a real backend using `localStorage`, so the app is fully usable standalone. Every mock function is `async` and shaped like a real REST call — swapping in a live backend later means rewriting `src/api/mockApi.js` only; no component changes needed.

## Design choices

- **Palette** — deep ink navy (`#14313D`) for structure and text, warm amber (`#E08E45`) for deadlines/attention, forest green (`#2F7A5C`) for completed states, and rust (`#B4483A`) for blocked/error states, on a soft off-white paper background. Chosen to feel academic and calm rather than "SaaS dashboard generic."
- **Type** — [Fraunces](https://fonts.google.com/specimen/Fraunces) (serif) for headings gives the app a bit of warmth and character; [Inter](https://fonts.google.com/specimen/Inter) (sans) handles UI and body text for legibility at small sizes.
- **Layout** — left-aligned, card-based course grids, single-column assignment lists so deadlines and statuses are easy to scan top-to-bottom.
- **Motion** — kept deliberately minimal: a toast slide-up on confirmation, a progress-bar fill transition, and hover/focus states. No decorative animation.
- **Auth flow** — token stored in `localStorage`, decoded client-side to restore the session on reload, mirroring a real JWT flow without needing a live server.

## Role-based flows implemented

**Professor**
- Login/Register → redirected to `/professor`
- Dashboard of taught courses → click into a course's Assignments page
- Create / edit assignments (title, description, deadline, OneDrive link, submission type)
- Per-assignment submission progress (`x / y students` or `x / y groups`) with a progress bar
- Search by title and filter by completion status

**Student**
- Login/Register → redirected to `/student`
- Dashboard of enrolled courses (current semester)
- Assignment page per course showing title, description, deadline, OneDrive link, submission type, and acknowledgment status
- **Individual assignments**: each student acknowledges their own submission ("Yes, I have submitted"), timestamped
- **Group assignments**: only the group leader can acknowledge; once acknowledged, every member's dashboard shows "Acknowledged"
- Students not in a group for a group assignment see: *"You are not part of any group. Form or join one to submit this assignment."*
- Status badges, progress bars, and toast confirmations throughout

## Project structure

```
src/
├── api/
│   ├── db.js          # seed data + localStorage persistence
│   └── mockApi.js      # async functions simulating REST endpoints (swap this for a real backend)
├── context/
│   ├── AuthContext.jsx  # login/register/logout, session restore from token
│   └── ToastContext.jsx # global toast notifications
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx   # role-based route guarding
│   ├── ProgressBar.jsx
│   └── StatusBadge.jsx
├── pages/
│   ├── Login.jsx / Register.jsx
│   ├── RoleRedirect.jsx          # sends "/" to the right dashboard by role
│   ├── ProfessorDashboard.jsx / ProfessorAssignments.jsx
│   └── StudentDashboard.jsx / StudentAssignments.jsx
├── App.jsx    # routes
└── index.css  # design tokens (Tailwind v4 @theme) + global styles
```

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## Demo accounts

The mock database seeds two roles so you can try both flows immediately:

| Role       | Email                        | Password    |
|------------|-------------------------------|-------------|
| Professor  | meera.nair@university.edu     | password123 |
| Student    | ananya.rao@university.edu     | password123 |
| Student (no group, to see the empty-state prompt) | rohan.das@university.edu | password123 |

You can also register a new account from `/register` and pick either role.

## Connecting a real backend later

Replace the contents of `src/api/mockApi.js` with real `fetch`/`axios` calls to your API — every function already returns the exact shape (`{ token, user }`, arrays of assignments with computed stats, etc.) that the pages expect, so no component code needs to change. `AuthContext` only calls `api.login`, `api.register`, `api.getCurrentUser` — point those at your real auth endpoints and swap the token for a real JWT.

## Tech stack

React 18 · React Router 6 · Tailwind CSS v4 · Vite
