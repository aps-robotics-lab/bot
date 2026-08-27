/**
 * ROBO KRITI 2026 - AUTHOR DASHBOARD OPERATIONS MODULE
 * Classified Command Center
 */
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, push, set, remove, update } from 'firebase/database';

document.addEventListener('DOMContentLoaded', () => {
  const authGate = document.getElementById('auth-gate-section');
  const dashboard = document.getElementById('author-dashboard-section');
  const loginForm = document.getElementById('author-login-form');
  const logoutBtn = document.getElementById('dash-logout-btn');
  const loginError = document.getElementById('auth-error-msg');

  // Stats
  const statRegCount = document.getElementById('stat-reg-count');
  const statHelpCount = document.getElementById('stat-help-count');
  const statAnnCount = document.getElementById('stat-ann-count');

  // Registrations state
  let allRegistrations = [];
  const regTableBody = document.getElementById('reg-table-body');
  const regSearchInput = document.getElementById('regSearchInput');
  const regEventFilter = document.getElementById('regEventFilter');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // Help queries state
  let allHelpQueries = [];
  const helpTableBody = document.getElementById('help-table-body');

  // Announcements state
  let allAnnouncements = [];
  const annListBody = document.getElementById('ann-list-body');
  const createAnnForm = document.getElementById('create-ann-form');

  // Tabs
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const tabPanes = document.querySelectorAll('.dash-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-target'));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Check login state
  function setLoggedIn(isLoggedIn, userEmail = 'admin@robokriti.aps') {
    if (isLoggedIn) {
      if (authGate) authGate.style.display = 'none';
      if (dashboard) dashboard.classList.add('active');
      const userDisplay = document.getElementById('dash-current-user');
      if (userDisplay) userDisplay.textContent = userEmail;
      loadAllDashboardData();
    } else {
      if (authGate) authGate.style.display = 'block';
      if (dashboard) dashboard.classList.remove('active');
    }
  }

  // Check Local Auth or Firebase Auth
  const localAuth = sessionStorage.getItem('rk26_author_auth');
  if (localAuth === 'true') {
    setLoggedIn(true, sessionStorage.getItem('rk26_author_email') || 'operations@robokriti.aps');
  } else if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true, user.email);
      } else {
        setLoggedIn(false);
      }
    });
  }

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const pass = document.getElementById('authPass').value.trim();

      try {
        if (auth && email.includes('@') && pass.length >= 6) {
          try {
            await signInWithEmailAndPassword(auth, email, pass);
            setLoggedIn(true, email);
            return;
          } catch (fbErr) {
            console.warn("Firebase Auth fallback to master key pass:", fbErr);
          }
        }

        // Master Tactical Security PIN / Passcode check
        if (pass === 'ROBOKRITI2026' || pass === 'admin123' || pass === 'apslucknow') {
          sessionStorage.setItem('rk26_author_auth', 'true');
          sessionStorage.setItem('rk26_author_email', email);
          setLoggedIn(true, email);
        } else {
          if (loginError) {
            loginError.textContent = 'ACCESS DENIED: Invalid Security Credentials or Clearance Key.';
            loginError.style.display = 'block';
          }
        }
      } catch (err) {
        if (loginError) {
          loginError.textContent = 'Authentication error: ' + err.message;
          loginError.style.display = 'block';
        }
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('rk26_author_auth');
      sessionStorage.removeItem('rk26_author_email');
      if (auth) signOut(auth);
      setLoggedIn(false);
    });
  }

  // Load and subscribe to dashboard data
  function loadAllDashboardData() {
    // 1. Registrations
    if (db) {
      onValue(ref(db, 'registrations'), (snap) => {
        const val = snap.val();
        allRegistrations = val ? Object.keys(val).map(k => ({ id: k, ...val[k] })) : [];
        // Combine with localStorage if needed
        const local = JSON.parse(localStorage.getItem('rk26_registrations') || '[]');
        local.forEach(l => {
          if (!allRegistrations.some(r => r.regId === l.regId)) {
            allRegistrations.push(l);
          }
        });
        if (statRegCount) statRegCount.textContent = allRegistrations.length;
        renderRegistrations();
      });
    } else {
      allRegistrations = JSON.parse(localStorage.getItem('rk26_registrations') || '[]');
      if (statRegCount) statRegCount.textContent = allRegistrations.length;
      renderRegistrations();
    }

    // 2. Help Queries
    if (db) {
      onValue(ref(db, 'helpForms'), (snap) => {
        const val = snap.val();
        allHelpQueries = val ? Object.keys(val).map(k => ({ id: k, ...val[k] })) : [];
        if (statHelpCount) statHelpCount.textContent = allHelpQueries.length;
        renderHelpQueries();
      });
    } else {
      allHelpQueries = JSON.parse(localStorage.getItem('rk26_helpforms') || '[]');
      if (statHelpCount) statHelpCount.textContent = allHelpQueries.length;
      renderHelpQueries();
    }

    // 3. Announcements
    if (db) {
      onValue(ref(db, 'announcements'), (snap) => {
        const val = snap.val();
        allAnnouncements = val ? Object.keys(val).map(k => ({ id: k, ...val[k] })) : [];
        if (statAnnCount) statAnnCount.textContent = allAnnouncements.length;
        renderAnnouncementsList();
      });
    }
  }

  // Render registrations table with search/filter
  function renderRegistrations() {
    if (!regTableBody) return;
    const query = (regSearchInput?.value || '').toLowerCase();
    const eventFilter = regEventFilter?.value || 'ALL';

    const filtered = allRegistrations.filter(r => {
      const matchQuery = (r.teamName || '').toLowerCase().includes(query) ||
                         (r.regId || '').toLowerCase().includes(query) ||
                         (r.email || '').toLowerCase().includes(query);
      const matchEvent = eventFilter === 'ALL' || r.event === eventFilter;
      return matchQuery && matchEvent;
    });

    if (filtered.length === 0) {
      regTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">No matching registrations logged yet.</td></tr>`;
      return;
    }

    regTableBody.innerHTML = filtered.map(r => `
      <tr>
        <td><code>${r.regId || 'N/A'}</code></td>
        <td><strong>${r.teamName || 'Solo'}</strong></td>
        <td><span class="hud-tag">${r.event || 'Robo Race'}</span></td>
        <td>Class ${r.classGrade || '-'} (${r.section || '-'})</td>
        <td>${r.email || '-'}<br><small style="color:var(--text-muted);">${r.phone || '-'}</small></td>
        <td>${r.teamSize || '1'} Member(s)</td>
        <td><span style="color:var(--accent-green);">● ${r.status || 'CONFIRMED'}</span></td>
      </tr>
    `).join('');
  }

  if (regSearchInput) regSearchInput.addEventListener('input', renderRegistrations);
  if (regEventFilter) regEventFilter.addEventListener('change', renderRegistrations);

  // CSV Export
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (allRegistrations.length === 0) {
        alert('No registration data to export.');
        return;
      }

      const headers = ['Registration ID', 'Team Name', 'Event', 'Class', 'Section', 'School', 'Email', 'Phone', 'Team Size', 'Team Members', 'Mentor', 'Timestamp'];
      const rows = allRegistrations.map(r => [
        `"${r.regId || ''}"`,
        `"${r.teamName || ''}"`,
        `"${r.event || ''}"`,
        `"${r.classGrade || ''}"`,
        `"${r.section || ''}"`,
        `"${r.school || ''}"`,
        `"${r.email || ''}"`,
        `"${r.phone || ''}"`,
        `"${r.teamSize || ''}"`,
        `"${(r.teamMembers || '').replace(/"/g, '""')}"`,
        `"${r.mentorName || ''}"`,
        `"${r.timestamp || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ROBO_KRITI_2026_REGISTRATIONS_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Render Help queries table
  function renderHelpQueries() {
    if (!helpTableBody) return;
    if (allHelpQueries.length === 0) {
      helpTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">No support queries recorded.</td></tr>`;
      return;
    }

    helpTableBody.innerHTML = allHelpQueries.map(q => `
      <tr>
        <td><code>${q.ticketId || 'TICKET'}</code></td>
        <td><strong>${q.name}</strong><br><small style="color:var(--text-muted);">${q.email}</small></td>
        <td><span class="hud-tag">${q.event || 'General'}</span></td>
        <td><strong>${q.subject}</strong><br><small>${q.message}</small></td>
        <td>${q.status === 'RESOLVED' ? '<span style="color:var(--accent-green);">RESOLVED</span>' : '<span style="color:var(--accent-orange);">OPEN</span>'}</td>
        <td>
          ${q.status !== 'RESOLVED' ? `
            <button class="btn-tech" style="padding:4px 10px; font-size:0.75rem;" onclick="window.resolveQuery('${q.id}')">MARK RESOLVED</button>
          ` : 'Done'}
        </td>
      </tr>
    `).join('');
  }

  window.resolveQuery = async (queryId) => {
    if (db && queryId) {
      try {
        await update(ref(db, `helpForms/${queryId}`), { status: 'RESOLVED' });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Render announcements list
  function renderAnnouncementsList() {
    if (!annListBody) return;
    if (allAnnouncements.length === 0) {
      annListBody.innerHTML = `<div style="text-align:center; color:var(--text-muted);">No custom announcements created yet.</div>`;
      return;
    }

    annListBody.innerHTML = allAnnouncements.map(a => `
      <div class="hud-panel" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:start;">
        <div>
          <div style="display:flex; gap:8px; margin-bottom:6px;">
            <span class="priority-pill priority-${a.priority || 'GENERAL'}">${a.priority || 'GENERAL'}</span>
            <span class="hud-tag">${a.category || 'BROADCAST'}</span>
          </div>
          <h4 style="color:#fff; font-size:1.1rem;">${a.title}</h4>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:4px;">${a.body}</p>
        </div>
        <button class="btn-tech btn-tech-outline" style="padding:6px 12px; font-size:0.75rem; border-color:var(--accent-red); color:var(--accent-red);" onclick="window.deleteAnnouncement('${a.id}')">DELETE</button>
      </div>
    `).join('');
  }

  window.deleteAnnouncement = async (annId) => {
    if (confirm('Delete this broadcast signal?') && db && annId) {
      try {
        await remove(ref(db, `announcements/${annId}`));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Create announcement
  if (createAnnForm) {
    createAnnForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('newAnnTitle').value.trim();
      const body = document.getElementById('newAnnBody').value.trim();
      const priority = document.getElementById('newAnnPriority').value;
      const category = document.getElementById('newAnnCategory').value;

      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST';

      const record = {
        title,
        body,
        priority,
        category,
        timestamp: new Date().toISOString(),
        date: dateStr,
        time: timeStr
      };

      if (db) {
        await set(push(ref(db, 'announcements')), record);
      }
      createAnnForm.reset();
      alert('Broadcast transmission published live.');
    });
  }

  // Results Form
  const resultsForm = document.getElementById('update-results-form');
  if (resultsForm) {
    resultsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const evKey = document.getElementById('resEventKey').value;
      const evName = document.getElementById('resEventKey').selectedOptions[0].text;
      const status = document.getElementById('resStatus').value.trim();

      const r1 = document.getElementById('rank1Team').value.trim();
      const s1 = document.getElementById('rank1Score').value.trim();
      const r2 = document.getElementById('rank2Team').value.trim();
      const s2 = document.getElementById('rank2Score').value.trim();
      const r3 = document.getElementById('rank3Team').value.trim();
      const s3 = document.getElementById('rank3Score').value.trim();

      const payload = {
        eventName: evName,
        status: status || 'FINAL STANDINGS',
        standings: [
          { rank: '01', team: r1 || 'TBD', score: s1 || '1st Place' },
          { rank: '02', team: r2 || 'TBD', score: s2 || '2nd Place' },
          { rank: '03', team: r3 || 'TBD', score: s3 || '3rd Place' }
        ]
      };

      if (db) {
        await update(ref(db, `results/${evKey}`), payload);
        alert(`Standings for ${evName} updated live!`);
      }
    });
  }
});
