/**
 * ROBO KRITI 2026 - FIREBASE MODULE
 * Realtime Database & Auth Integration
 */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, get, update, remove } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDW7Wi_8ea-Ph1TvIEpobXeIFUQQox_Yhg",
  authDomain: "robokriti-2026.firebaseapp.com",
  databaseURL: "https://robokriti-2026-default-rtdb.firebaseio.com",
  projectId: "robokriti-2026",
  storageBucket: "robokriti-2026.firebasestorage.app",
  messagingSenderId: "914721813222",
  appId: "1:914721813222:web:57abd3093b8255330dc127",
  measurementId: "G-Z0S778MGZZ"
};

let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase initialized with local fallback:", err);
}

export { app, db, auth };

/**
 * Submit participant registration to RTDB 'registrations'
 */
export async function submitRegistration(data) {
  const regId = `RK26-${data.eventCode || 'REG'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    ...data,
    regId,
    timestamp: new Date().toISOString(),
    status: 'CONFIRMED'
  };

  try {
    if (db) {
      const regRef = push(ref(db, 'registrations'));
      await set(regRef, record);
    }
  } catch (e) {
    console.warn("RTDB write error, saving to local state:", e);
  }

  // Backup to localStorage for resilience
  try {
    const local = JSON.parse(localStorage.getItem('rk26_registrations') || '[]');
    local.unshift(record);
    localStorage.setItem('rk26_registrations', JSON.stringify(local));
  } catch (e) {}

  return record;
}

/**
 * Submit Help Desk Query to RTDB 'helpForms'
 */
export async function submitHelpForm(data) {
  const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    ...data,
    ticketId,
    timestamp: new Date().toISOString(),
    status: 'OPEN'
  };

  try {
    if (db) {
      const helpRef = push(ref(db, 'helpForms'));
      await set(helpRef, record);
    }
  } catch (e) {
    console.warn("RTDB helpForms write error:", e);
  }

  try {
    const local = JSON.parse(localStorage.getItem('rk26_helpforms') || '[]');
    local.unshift(record);
    localStorage.setItem('rk26_helpforms', JSON.stringify(local));
  } catch (e) {}

  return record;
}

/**
 * Subscribe to Announcements from RTDB 'announcements'
 */
export function subscribeAnnouncements(callback) {
  const defaultAnnouncements = [
    {
      id: 'ann-1',
      title: 'REGISTRATION WINDOW ACTIVATED',
      body: 'All students of Army Public School, Lucknow can now register their robotic units for ROBO KRITI 2026. Entry is 100% free.',
      category: 'GENERAL',
      priority: 'CRITICAL',
      timestamp: '2026-08-20T10:00:00Z',
      date: '20 AUG 2026',
      time: '10:00 IST'
    },
    {
      id: 'ann-2',
      title: 'ARENA SPECIFICATIONS BROADCAST: ROBO WAR',
      body: 'Combat arena hazard matrix and safety enclosure dimensions have been updated in the official rulebook. Check weapon rpm restrictions.',
      category: 'EVENT',
      priority: 'IMPORTANT',
      timestamp: '2026-08-24T14:30:00Z',
      date: '24 AUG 2026',
      time: '14:30 IST'
    },
    {
      id: 'ann-3',
      title: 'TINKERING LAB WORKSHOP SCHEDULE',
      body: 'Tinkering & Robotics Lab will host open practice sessions for Robo Race speed tuning starting 28 August 2026.',
      category: 'GENERAL',
      priority: 'EVENT',
      timestamp: '2026-08-26T09:00:00Z',
      date: '26 AUG 2026',
      time: '09:00 IST'
    }
  ];

  if (!db) {
    callback(defaultAnnouncements);
    return () => {};
  }

  try {
    const annRef = ref(db, 'announcements');
    return onValue(annRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        callback(list);
      } else {
        callback(defaultAnnouncements);
      }
    }, (error) => {
      console.warn("RTDB announcements listener error:", error);
      callback(defaultAnnouncements);
    });
  } catch (e) {
    callback(defaultAnnouncements);
    return () => {};
  }
}

/**
 * Subscribe to Results from RTDB 'results'
 */
export function subscribeResults(callback) {
  const defaultResults = {
    race: {
      eventName: 'ROBO RACE',
      status: 'SCHEDULED - 03 SEP 2026',
      standings: [
        { rank: '01', team: 'Vortex Vector', score: 'TBD (Qualifiers)' },
        { rank: '02', team: 'Hyperion Speed', score: 'TBD' },
        { rank: '03', team: 'Apex Circuit', score: 'TBD' }
      ]
    },
    war: {
      eventName: 'ROBO WAR',
      status: 'SCHEDULED - 03 SEP 2026',
      standings: [
        { rank: '01', team: 'Titan Crusher', score: 'TBD (Weigh-in)' },
        { rank: '02', team: 'Oblivion Claw', score: 'TBD' },
        { rank: '03', team: 'Iron Phantom', score: 'TBD' }
      ]
    },
    tug: {
      eventName: 'ROBO TUG OF WAR',
      status: 'SCHEDULED - 03 SEP 2026',
      standings: [
        { rank: '01', team: 'Goliath Torque', score: 'TBD' },
        { rank: '02', team: 'Traction Prime', score: 'TBD' },
        { rank: '03', team: 'Mammoth Core', score: 'TBD' }
      ]
    },
    soccer: {
      eventName: 'ROBO SOCCER',
      status: 'SCHEDULED - 03 SEP 2026',
      standings: [
        { rank: '01', team: 'Striker AI', score: 'TBD' },
        { rank: '02', team: 'Cyber Kickers', score: 'TBD' },
        { rank: '03', team: 'Goal Matrix', score: 'TBD' }
      ]
    }
  };

  if (!db) {
    callback(defaultResults);
    return () => {};
  }

  try {
    const resRef = ref(db, 'results');
    return onValue(resRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      } else {
        callback(defaultResults);
      }
    }, (err) => {
      console.warn("Results listener fallback:", err);
      callback(defaultResults);
    });
  } catch (e) {
    callback(defaultResults);
    return () => {};
  }
}
