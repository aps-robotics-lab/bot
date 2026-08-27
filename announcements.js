/**
 * ROBO KRITI 2026 - LIVE BROADCAST & RESULTS FEED
 */
import { subscribeAnnouncements, subscribeResults } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('announcements-feed');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'ALL';
  let allAnnouncements = [];

  function renderAnnouncements(items) {
    if (!feedContainer) return;
    
    const filtered = currentFilter === 'ALL' 
      ? items 
      : items.filter(it => (it.category || '').toUpperCase() === currentFilter || (it.priority || '').toUpperCase() === currentFilter);

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div class="hud-panel" style="text-align:center; color:var(--text-muted);">
          NO BROADCAST SIGNALS FOUND UNDER FILTER [${currentFilter}]
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(item => `
      <div class="timeline-item">
        <div class="timeline-node"></div>
        <div class="announce-card">
          <div class="announce-meta">
            <span class="priority-pill priority-${item.priority || 'GENERAL'}">${item.priority || 'GENERAL'}</span>
            <span class="hud-tag">${item.category || 'BROADCAST'}</span>
            <span class="announce-date">${item.date || 'AUGUST 2026'} // ${item.time || 'LIVE'}</span>
          </div>
          <h3 class="announce-title">${item.title}</h3>
          <p class="announce-body">${item.body}</p>
        </div>
      </div>
    `).join('');
  }

  // Subscribe to live announcements
  subscribeAnnouncements((data) => {
    allAnnouncements = data;
    renderAnnouncements(allAnnouncements);
  });

  // Filter interaction
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'ALL';
      renderAnnouncements(allAnnouncements);
    });
  });

  // Render live results standings
  subscribeResults((resData) => {
    const resultsContainer = document.getElementById('results-grid-container');
    if (!resultsContainer || !resData) return;

    const events = ['race', 'war', 'tug', 'soccer'];
    resultsContainer.innerHTML = events.map(key => {
      const ev = resData[key] || { eventName: key.toUpperCase(), status: 'SCHEDULED', standings: [] };
      const standings = ev.standings || [];
      return `
        <div class="result-card">
          <div class="result-discipline-header">
            <div>
              <span class="hud-tag">${ev.status || 'SCHEDULED'}</span>
              <h3 class="font-tech" style="font-size:1.6rem; color:#fff; margin-top:8px;">${ev.eventName}</h3>
            </div>
          </div>
          <div class="podium-list">
            ${standings.map(s => `
              <div class="podium-item">
                <span class="podium-rank rank-${s.rank}">${s.rank}</span>
                <span class="podium-team">${s.team}</span>
                <span class="podium-score">${s.score}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  });
});
