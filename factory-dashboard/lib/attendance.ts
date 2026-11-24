import fs from 'fs';
import path from 'path';

export interface AttendanceSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  date: string; // YYYY-MM-DD
  loginTime: string; // e.g. "09:14 AM"
  loginTimestamp: string;
  logoutTime: string | null;
  logoutTimestamp: string | null;
  durationMinutes: number | null;
  status: 'active' | 'completed';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance_sessions.json');

// Ensure data directory exists
function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ATTENDANCE_FILE)) {
    // Seed with realistic shift logs for recent days so the Owner calendar looks rich immediately
    const initialSessions: AttendanceSession[] = [
      {
        id: 'att_seed_01',
        userId: '3fc87ef4-6d51-48b3-9354-c8bc86fc47cf',
        userName: 'Hamza',
        email: 'shafiqh862@gmail.com',
        role: 'hamza',
        date: '2026-10-21',
        loginTime: '08:45 AM',
        loginTimestamp: '2026-10-21T03:45:00.000Z',
        logoutTime: null,
        logoutTimestamp: null,
        durationMinutes: null,
        status: 'active',
      },
      {
        id: 'att_seed_02',
        userId: '332956b9-3ed6-4903-90a8-6d1128a15505',
        userName: 'Usman',
        email: 'usmannaeem0700016@gmail.com',
        role: 'usman',
        date: '2026-10-21',
        loginTime: '09:10 AM',
        loginTimestamp: '2026-10-21T04:10:00.000Z',
        logoutTime: null,
        logoutTimestamp: null,
        durationMinutes: null,
        status: 'active',
      },
      {
        id: 'att_seed_03',
        userId: '370233b1-095c-4a7d-817f-99365d7037f9',
        userName: 'Muhammad Umair',
        email: 'khanirtaza786@gmail.com',
        role: 'umair',
        date: '2026-10-21',
        loginTime: '09:25 AM',
        loginTimestamp: '2026-10-21T04:25:00.000Z',
        logoutTime: null,
        logoutTimestamp: null,
        durationMinutes: null,
        status: 'active',
      },
      {
        id: 'att_seed_04',
        userId: '27f37d24-e376-4349-8bf9-9df1a0d92b37',
        userName: 'Mubasher',
        email: 'mi1810638@gmail.com',
        role: 'mubasher',
        date: '2026-10-21',
        loginTime: '08:30 AM',
        loginTimestamp: '2026-10-21T03:30:00.000Z',
        logoutTime: null,
        logoutTimestamp: null,
        durationMinutes: null,
        status: 'active',
      },
      {
        id: 'att_seed_05',
        userId: '358625de-a670-4fb7-aa2f-b8f237f5fb39',
        userName: 'Ashfaq',
        email: 'ashfaq@gmail.com',
        role: 'ashfaq',
        date: '2026-10-21',
        loginTime: '09:00 AM',
        loginTimestamp: '2026-10-21T04:00:00.000Z',
        logoutTime: null,
        logoutTimestamp: null,
        durationMinutes: null,
        status: 'active',
      },
      // Yesterday: 2026-10-20
      {
        id: 'att_seed_06',
        userId: '3fc87ef4-6d51-48b3-9354-c8bc86fc47cf',
        userName: 'Hamza',
        email: 'shafiqh862@gmail.com',
        role: 'hamza',
        date: '2026-10-20',
        loginTime: '08:50 AM',
        loginTimestamp: '2026-10-20T03:50:00.000Z',
        logoutTime: '06:15 PM',
        logoutTimestamp: '2026-10-20T13:15:00.000Z',
        durationMinutes: 565,
        status: 'completed',
      },
      {
        id: 'att_seed_07',
        userId: '332956b9-3ed6-4903-90a8-6d1128a15505',
        userName: 'Usman',
        email: 'usmannaeem0700016@gmail.com',
        role: 'usman',
        date: '2026-10-20',
        loginTime: '09:05 AM',
        loginTimestamp: '2026-10-20T04:05:00.000Z',
        logoutTime: '06:40 PM',
        logoutTimestamp: '2026-10-20T13:40:00.000Z',
        durationMinutes: 575,
        status: 'completed',
      },
      {
        id: 'att_seed_08',
        userId: '370233b1-095c-4a7d-817f-99365d7037f9',
        userName: 'Muhammad Umair',
        email: 'khanirtaza786@gmail.com',
        role: 'umair',
        date: '2026-10-20',
        loginTime: '09:20 AM',
        loginTimestamp: '2026-10-20T04:20:00.000Z',
        logoutTime: '06:30 PM',
        logoutTimestamp: '2026-10-20T13:30:00.000Z',
        durationMinutes: 550,
        status: 'completed',
      },
      {
        id: 'att_seed_09',
        userId: '27f37d24-e376-4349-8bf9-9df1a0d92b37',
        userName: 'Mubasher',
        email: 'mi1810638@gmail.com',
        role: 'mubasher',
        date: '2026-10-20',
        loginTime: '08:35 AM',
        loginTimestamp: '2026-10-20T03:35:00.000Z',
        logoutTime: '07:10 PM',
        logoutTimestamp: '2026-10-20T14:10:00.000Z',
        durationMinutes: 635,
        status: 'completed',
      },
      {
        id: 'att_seed_10',
        userId: '358625de-a670-4fb7-aa2f-b8f237f5fb39',
        userName: 'Ashfaq',
        email: 'ashfaq@gmail.com',
        role: 'ashfaq',
        date: '2026-10-20',
        loginTime: '09:00 AM',
        loginTimestamp: '2026-10-20T04:00:00.000Z',
        logoutTime: '05:45 PM',
        logoutTimestamp: '2026-10-20T12:45:00.000Z',
        durationMinutes: 525,
        status: 'completed',
      },
      // Earlier Shift: 2026-10-19
      {
        id: 'att_seed_11',
        userId: '3fc87ef4-6d51-48b3-9354-c8bc86fc47cf',
        userName: 'Hamza',
        email: 'shafiqh862@gmail.com',
        role: 'hamza',
        date: '2026-10-19',
        loginTime: '08:40 AM',
        loginTimestamp: '2026-10-19T03:40:00.000Z',
        logoutTime: '06:00 PM',
        logoutTimestamp: '2026-10-19T13:00:00.000Z',
        durationMinutes: 560,
        status: 'completed',
      },
      {
        id: 'att_seed_12',
        userId: '332956b9-3ed6-4903-90a8-6d1128a15505',
        userName: 'Usman',
        email: 'usmannaeem0700016@gmail.com',
        role: 'usman',
        date: '2026-10-19',
        loginTime: '09:00 AM',
        loginTimestamp: '2026-10-19T04:00:00.000Z',
        logoutTime: '06:30 PM',
        logoutTimestamp: '2026-10-19T13:30:00.000Z',
        durationMinutes: 570,
        status: 'completed',
      },
      {
        id: 'att_seed_13',
        userId: '27f37d24-e376-4349-8bf9-9df1a0d92b37',
        userName: 'Mubasher',
        email: 'mi1810638@gmail.com',
        role: 'mubasher',
        date: '2026-10-19',
        loginTime: '08:30 AM',
        loginTimestamp: '2026-10-19T03:30:00.000Z',
        logoutTime: '07:00 PM',
        logoutTimestamp: '2026-10-19T14:00:00.000Z',
        durationMinutes: 630,
        status: 'completed',
      },
      {
        id: 'att_seed_14',
        userId: '358625de-a670-4fb7-aa2f-b8f237f5fb39',
        userName: 'Ashfaq',
        email: 'ashfaq@gmail.com',
        role: 'ashfaq',
        date: '2026-10-19',
        loginTime: '09:10 AM',
        loginTimestamp: '2026-10-19T04:10:00.000Z',
        logoutTime: '06:00 PM',
        logoutTimestamp: '2026-10-19T13:00:00.000Z',
        durationMinutes: 530,
        status: 'completed',
      },
      // 2026-10-18
      {
        id: 'att_seed_15',
        userId: '3fc87ef4-6d51-48b3-9354-c8bc86fc47cf',
        userName: 'Hamza',
        email: 'shafiqh862@gmail.com',
        role: 'hamza',
        date: '2026-10-18',
        loginTime: '08:50 AM',
        loginTimestamp: '2026-10-18T03:50:00.000Z',
        logoutTime: '06:10 PM',
        logoutTimestamp: '2026-10-18T13:10:00.000Z',
        durationMinutes: 560,
        status: 'completed',
      },
      {
        id: 'att_seed_16',
        userId: '27f37d24-e376-4349-8bf9-9df1a0d92b37',
        userName: 'Mubasher',
        email: 'mi1810638@gmail.com',
        role: 'mubasher',
        date: '2026-10-18',
        loginTime: '08:45 AM',
        loginTimestamp: '2026-10-18T03:45:00.000Z',
        logoutTime: '06:45 PM',
        logoutTimestamp: '2026-10-18T13:45:00.000Z',
        durationMinutes: 600,
        status: 'completed',
      },
    ];
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(initialSessions, null, 2), 'utf8');
  }
}

export function getAllAttendanceSessions(): AttendanceSession[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(ATTENDANCE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordLoginEvent(user: { id: string; name: string; email: string; role: string }): AttendanceSession {
  ensureFile();
  const sessions = getAllAttendanceSessions();

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Exclude owner from attendance tracking
  if (user.role === 'owner') {
    return {
      id: 'owner_exempt',
      userId: user.id,
      userName: user.name,
      email: user.email,
      role: 'owner',
      date: dateStr,
      loginTime: timeStr,
      loginTimestamp: now.toISOString(),
      logoutTime: null,
      logoutTimestamp: null,
      durationMinutes: null,
      status: 'active',
    };
  }

  // Check if there is already an active session today for this user
  const existingIndex = sessions.findIndex(
    (s) => s.userId === user.id && s.date === dateStr && s.status === 'active'
  );

  if (existingIndex >= 0) {
    return sessions[existingIndex];
  }

  const newSession: AttendanceSession = {
    id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    userId: user.id,
    userName: user.name,
    email: user.email,
    role: user.role,
    date: dateStr,
    loginTime: timeStr,
    loginTimestamp: now.toISOString(),
    logoutTime: null,
    logoutTimestamp: null,
    durationMinutes: null,
    status: 'active',
  };

  sessions.unshift(newSession);
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  return newSession;
}

export function recordLogoutEvent(userId: string): AttendanceSession | null {
  ensureFile();
  const sessions = getAllAttendanceSessions();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Find the latest active session for this user
  const index = sessions.findIndex((s) => s.userId === userId && s.status === 'active');

  if (index === -1) {
    return null;
  }

  const session = sessions[index];
  const loginTime = new Date(session.loginTimestamp).getTime();
  const logoutTime = now.getTime();
  const diffMinutes = Math.max(1, Math.round((logoutTime - loginTime) / (1000 * 60)));

  session.logoutTime = timeStr;
  session.logoutTimestamp = now.toISOString();
  session.durationMinutes = diffMinutes;
  session.status = 'completed';

  sessions[index] = session;
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  return session;
}
