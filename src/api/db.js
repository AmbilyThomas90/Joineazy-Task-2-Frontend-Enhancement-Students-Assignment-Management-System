
// ============================================================
// MOCK DATABASE
// This simulates a real backend database for the frontend.
// ============================================================

const STORAGE_KEY = 'sagms_db_v2';

// ============================================================
// SEED DATABASE
// ============================================================

const seed = () => ({
  // ----------------------------------------------------------
  // USERS
  // ----------------------------------------------------------
  users: [
    // Professor 1
    {
      id: 'u-prof-1',
      name: 'Dr. Meera Rao',
      email: 'meera.rao@university.edu',
      password: 'password123',
      role: 'professor',
    },

    // Professor 2
    {
      id: 'u-prof-2',
      name: 'Dr. Rahul Thomas',
      email: 'rahul.thomas@university.edu',
      password: 'password123',
      role: 'professor',
    },

    // Student 1
    {
      id: 'u-stu-1',
      name: 'Aarav Nair',
      email: 'aarav.nair@university.edu',
      password: 'password123',
      role: 'student',
    },

    // Student 2
    {
      id: 'u-stu-2',
      name: 'Diya Menon',
      email: 'diya.menon@university.edu',
      password: 'password123',
      role: 'student',
    },

    // Student 3
    {
      id: 'u-stu-3',
      name: 'Kabir Singh',
      email: 'kabir.singh@university.edu',
      password: 'password123',
      role: 'student',
    },

    // Student 4
    {
      id: 'u-stu-4',
      name: 'Zara Fernandes',
      email: 'zara.fernandes@university.edu',
      password: 'password123',
      role: 'student',
    },
  ],

  // ----------------------------------------------------------
  // COURSES
  // ----------------------------------------------------------
  courses: [
    // Professor 1 - Data Structures
    {
      id: 'c-1',
      name: 'Data Structures & Algorithms',
      code: 'CS201',
      semester: 'Fall 2026',
      professorId: 'u-prof-1',
      studentIds: [
        'u-stu-1',
        'u-stu-2',
        'u-stu-3',
        'u-stu-4',
      ],
    },

    // Professor 1 - Database Systems
    {
      id: 'c-2',
      name: 'Database Systems',
      code: 'CS305',
      semester: 'Fall 2026',
      professorId: 'u-prof-1',
      studentIds: [
        'u-stu-1',
        'u-stu-2',
        'u-stu-3',
      ],
    },

    // Professor 1 - Operating Systems
    {
      id: 'c-3',
      name: 'Operating Systems',
      code: 'CS310',
      semester: 'Fall 2026',
      professorId: 'u-prof-1',
      studentIds: [
        'u-stu-1',
        'u-stu-2',
        'u-stu-3',
        'u-stu-4',
      ],
    },

    // Professor 2 - Web Technologies
    {
      id: 'c-4',
      name: 'Web Technologies',
      code: 'CS320',
      semester: 'Fall 2026',
      professorId: 'u-prof-2',
      studentIds: [
        'u-stu-2',
        'u-stu-4',
      ],
    },
  ],

  // ----------------------------------------------------------
  // GROUPS
  // ----------------------------------------------------------
  groups: [
    // Data Structures & Algorithms
    {
      id: 'g-1',
      courseId: 'c-1',
      name: 'Team Recursion',
      leaderId: 'u-stu-1',
      memberIds: [
        'u-stu-1',
        'u-stu-2',
      ],
    },

    {
      id: 'g-2',
      courseId: 'c-1',
      name: 'Team Heapsort',
      leaderId: 'u-stu-3',
      memberIds: [
        'u-stu-3',
      ],
    },

    // Web Technologies
    {
      id: 'g-3',
      courseId: 'c-4',
      name: 'Team WebMasters',
      leaderId: 'u-stu-2',
      memberIds: [
        'u-stu-2',
        'u-stu-4',
      ],
    },

    // u-stu-4 has no group in c-1 intentionally.
  ],

  // ----------------------------------------------------------
  // ASSIGNMENTS
  // ----------------------------------------------------------
  assignments: [
    // --------------------------------------------------------
    // Data Structures Assignment
    // --------------------------------------------------------
    {
      id: 'a-1',
      courseId: 'c-1',

      title: 'Data Structures — Problem Set 4',

      description:
        'Implement a balanced binary search tree and analyze the time complexity of insert, delete, and search operations.',

      deadline: '2026-10-02T23:59:00',

      link:
        'https://docs.google.com/document/d/1Tg5eXkUmlcRVxpZNd6J4EEVGiQ3-LZ57n2JX31sCilg/edit?usp=sharing',

      submissionType: 'individual',

      createdBy: 'u-prof-1',

      createdAt: '2026-09-18T09:00:00.000Z',
    },

    // --------------------------------------------------------
    // Graph Traversal Assignment
    // --------------------------------------------------------
    {
      id: 'a-2',
      courseId: 'c-1',

      title: 'Graph Traversal Mini-Project',

      description:
        'Build a small visualizer for BFS and DFS graph traversal algorithms using a weighted graph. The project should be completed in groups of up to 3 students.',

      deadline: '2026-10-15T18:00:00',

      link:
        'https://onedrive.live.com/redir?resid=example-graph',

      submissionType: 'group',

      createdBy: 'u-prof-1',

      createdAt: '2026-09-20T09:00:00.000Z',
    },

    // --------------------------------------------------------
    // Database Systems Assignment
    // --------------------------------------------------------
    {
      id: 'a-3',
      courseId: 'c-2',

      title: 'Database Normalization & 3NF',

      description:
        'Normalize a given database schema up to Third Normal Form (3NF). Identify functional dependencies, primary keys, foreign keys, and explain each decomposition step.',

      deadline: '2026-10-08T23:59:00',

      link:
        'https://drive.google.com/drive/folders/1mT3dWXALUQyyHwfsmzTrxwQ6Gd7hdXb6?usp=sharing',

      submissionType: 'individual',

      createdBy: 'u-prof-1',

      createdAt: '2026-09-15T09:00:00.000Z',
    },

    // --------------------------------------------------------
    // Operating Systems Assignment
    // --------------------------------------------------------
    {
      id: 'a-4',
      courseId: 'c-3',

      title: 'Operating Systems — Scheduling Report',

      description:
        'Compare Round Robin and Priority Scheduling algorithms using simulated workloads. Analyze their performance and submit a three-page report.',

      deadline: '2026-10-06T23:59:00',

      link:
        'https://drive.google.com/drive/folders/1XdMA2l8BUoaOysRUoV5jIFFoqn-QHsGM?usp=sharing',

      submissionType: 'individual',

      createdBy: 'u-prof-1',

      createdAt: '2026-09-20T09:00:00.000Z',
    },

    // --------------------------------------------------------
    // Web Technologies Assignment - Professor 2
    // --------------------------------------------------------
    {
      id: 'a-5',
      courseId: 'c-4',

      title: 'Web Technologies — REST API Design',

      description:
        'Design a RESTful API for a student management system. Document the API endpoints, HTTP methods, request parameters, response formats, and basic error-handling strategy.',

      deadline: '2026-10-12T23:59:00',

      link:
        'https://drive.google.com/',

      submissionType: 'group',

      createdBy: 'u-prof-2',

      createdAt: '2026-09-30T09:00:00.000Z',
    },
  ],

  // ==========================================================
  // ACKNOWLEDGMENTS / SUBMISSIONS
  //
  // Individual assignment:
  // {
  //   assignmentId,
  //   studentId,
  //   timestamp
  // }
  //
  // Group assignment:
  // {
  //   assignmentId,
  //   groupId,
  //   timestamp
  // }
  // ==========================================================

  acknowledgments: [
    // --------------------------------------------------------
    // a-1: Data Structures — Individual
    // --------------------------------------------------------

    {
      id: 'ack-1',
      assignmentId: 'a-1',
      studentId: 'u-stu-1',
      timestamp: '2026-09-24T14:20:00.000Z',
    },

    {
      id: 'ack-2',
      assignmentId: 'a-1',
      studentId: 'u-stu-3',
      timestamp: '2026-09-25T08:05:00.000Z',
    },

    // --------------------------------------------------------
    // a-2: Graph Traversal — Group
    // --------------------------------------------------------

    {
      id: 'ack-3',
      assignmentId: 'a-2',
      groupId: 'g-1',
      timestamp: '2026-09-27T10:30:00.000Z',
    },

    // --------------------------------------------------------
    // a-3: Database Normalization — Individual
    // --------------------------------------------------------

    {
      id: 'ack-4',
      assignmentId: 'a-3',
      studentId: 'u-stu-1',
      timestamp: '2026-09-20T10:00:00.000Z',
    },

    {
      id: 'ack-5',
      assignmentId: 'a-3',
      studentId: 'u-stu-2',
      timestamp: '2026-09-21T16:45:00.000Z',
    },

    {
      id: 'ack-6',
      assignmentId: 'a-3',
      studentId: 'u-stu-3',
      timestamp: '2026-09-22T09:30:00.000Z',
    },

    // --------------------------------------------------------
    // a-4: Operating Systems — Individual
    // --------------------------------------------------------

    {
      id: 'ack-7',
      assignmentId: 'a-4',
      studentId: 'u-stu-4',
      timestamp: '2026-09-23T11:00:00.000Z',
    },

    // --------------------------------------------------------
    // a-5: Web Technologies — Group
    // --------------------------------------------------------

    {
      id: 'ack-8',
      assignmentId: 'a-5',
      groupId: 'g-3',
      timestamp: '2026-09-29T15:30:00.000Z',
    },
  ],
});

// ============================================================
// LOAD DATABASE
// ============================================================

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Failed to load database:', error);
  }

  const fresh = seed();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(fresh)
  );

  return fresh;
}

// ============================================================
// SAVE DATABASE
// ============================================================

function save(db) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(db)
  );
}

// ============================================================
// GET DATABASE
// ============================================================

export function getDb() {
  return load();
}

// ============================================================
// UPDATE DATABASE
// ============================================================

export function setDb(updater) {
  const db = load();

  const next =
    typeof updater === 'function'
      ? updater(db)
      : updater;

  save(next);

  return next;
}

// ============================================================
// RESET DATABASE
// ============================================================

export function resetDb() {
  const fresh = seed();

  save(fresh);

  return fresh;
}
