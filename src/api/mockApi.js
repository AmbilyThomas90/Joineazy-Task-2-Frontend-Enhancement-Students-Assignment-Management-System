// Mock API surface. Every export is async and returns/throws the same shape

import { getDb, setDb } from './db';

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));
// CREATE TOKEN
function makeToken(user) {
 
  return btoa(JSON.stringify({ sub: user.id, role: user.role, iat: Date.now() }));
}
// DECODE TOKEN
function decodeToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}
// LOGIN
export async function login({ email, password }) {
  await delay();
  const db = getDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    const err = new Error('Invalid email or password.');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = makeToken(user);
  return { token, user: sanitize(user) };
}
// REGISTER
export async function register({ name, email, password, role }) {
  await delay();
  const db = getDb();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Error('An account with this email already exists.');
    err.code = 'EMAIL_TAKEN';
    throw err;
  }
  const user = { id: `u-${role}-${Date.now()}`, name, email, password, role };
  setDb((d) => ({ ...d, users: [...d.users, user] }));
  const token = makeToken(user);
  return { token, user: sanitize(user) };
}
// GET CURRENT USER
export async function getCurrentUser(token) {
  await delay(150);
  const payload = decodeToken(token);
  if (!payload) return null;
  const db = getDb();
  const user = db.users.find((u) => u.id === payload.sub);
  return user ? sanitize(user) : null;
}

function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}
// GET COURSES FOR USER
export async function getCoursesForUser(userId, role) {
  await delay();
  const db = getDb();
  const courses = role === 'professor'
    ? db.courses.filter((c) => c.professorId === userId)
    : db.courses.filter((c) => c.studentIds.includes(userId));
  return courses.map((c) => ({
    ...c,
    studentCount: c.studentIds.length,
    assignmentCount: db.assignments.filter((a) => a.courseId === c.id).length,
  }));
}
// GET SINGLE COURSE
export async function getCourse(courseId) {
  await delay(150);
  const db = getDb();
  return db.courses.find((c) => c.id === courseId) || null;
}
// GET ASSIGNMENTS FOR COURSE
export async function getAssignmentsForCourse(courseId) {
  await delay();
  const db = getDb();
  return db.assignments
    .filter((a) => a.courseId === courseId)
    .map((a) => enrichAssignmentStats(a, db));
}

function enrichAssignmentStats(assignment, db) {
  const course = db.courses.find((c) => c.id === assignment.courseId);
  if (assignment.submissionType === 'individual') {
    const total = course ? course.studentIds.length : 0;
    const acked = db.acknowledgments.filter((x) => x.assignmentId === assignment.id).length;
    return { ...assignment, totalUnits: total, submittedUnits: acked, unitLabel: 'students' };
  }
  const groups = db.groups.filter((g) => g.courseId === assignment.courseId);
  const total = groups.length;
  const acked = db.acknowledgments.filter(
    (x) => x.assignmentId === assignment.id && groups.some((g) => g.id === x.groupId)
  ).length;
  return { ...assignment, totalUnits: total, submittedUnits: acked, unitLabel: 'groups' };
}

export async function createAssignment(courseId, data) {
  await delay();
  const assignment = { id: `a-${Date.now()}`, courseId, ...data };
  setDb((d) => ({ ...d, assignments: [...d.assignments, assignment] }));
  const db = getDb();
  return enrichAssignmentStats(assignment, db);
}

export async function updateAssignment(assignmentId, data) {
  await delay();
  setDb((d) => ({
    ...d,
    assignments: d.assignments.map((a) => (a.id === assignmentId ? { ...a, ...data } : a)),
  }));
  const db = getDb();
  const updated = db.assignments.find((a) => a.id === assignmentId);
  return enrichAssignmentStats(updated, db);
}

export async function getStudentAssignmentView(courseId, studentId) {
  await delay();
  const db = getDb();
  const assignments = db.assignments.filter((a) => a.courseId === courseId);
  const myGroups = db.groups.filter((g) => g.courseId === courseId && g.memberIds.includes(studentId));

  return assignments.map((a) => {
    if (a.submissionType === 'individual') {
      const ack = db.acknowledgments.find((x) => x.assignmentId === a.id && x.studentId === studentId);
      return {
        ...a,
        myStatus: ack ? 'acknowledged' : 'pending',
        ackTimestamp: ack ? ack.timestamp : null,
        isGroupLeader: false,
        inGroup: true,
      };
    }
    const group = myGroups[0]; // student's group for this course
    if (!group) {
      return { ...a, myStatus: 'no-group', ackTimestamp: null, isGroupLeader: false, inGroup: false };
    }
    const ack = db.acknowledgments.find((x) => x.assignmentId === a.id && x.groupId === group.id);
    return {
      ...a,
      myStatus: ack ? 'acknowledged' : 'pending',
      ackTimestamp: ack ? ack.timestamp : null,
      isGroupLeader: group.leaderId === studentId,
      inGroup: true,
      groupName: group.name,
    };
  });
}

export async function acknowledgeIndividual(assignmentId, studentId) {
  await delay(300);
  const db = getDb();
  if (db.acknowledgments.some((x) => x.assignmentId === assignmentId && x.studentId === studentId)) {
    return { ok: true, timestamp: null };
  }
  const record = { id: `ack-${Date.now()}`, assignmentId, studentId, timestamp: new Date().toISOString() };
  setDb((d) => ({ ...d, acknowledgments: [...d.acknowledgments, record] }));
  return { ok: true, timestamp: record.timestamp };
}

export async function acknowledgeAsGroupLeader(assignmentId, groupId, leaderId) {
  await delay(300);
  const db = getDb();
  const group = db.groups.find((g) => g.id === groupId);
  if (!group || group.leaderId !== leaderId) {
    const err = new Error('Only the group leader can acknowledge this submission.');
    err.code = 'NOT_LEADER';
    throw err;
  }
  if (db.acknowledgments.some((x) => x.assignmentId === assignmentId && x.groupId === groupId)) {
    return { ok: true, timestamp: null };
  }
  const record = { id: `ack-${Date.now()}`, assignmentId, groupId, timestamp: new Date().toISOString() };
  setDb((d) => ({ ...d, acknowledgments: [...d.acknowledgments, record] }));
  return { ok: true, timestamp: record.timestamp };
}

export async function getMyGroupForCourse(courseId, studentId) {
  await delay(150);
  const db = getDb();
  return db.groups.find((g) => g.courseId === courseId && g.memberIds.includes(studentId)) || null;
}
