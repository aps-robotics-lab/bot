/**
 * ROBO KRITI 2026 - REAL-TIME COUNTDOWN CONTROLLER
 * 1. Competition Date: 03 September 2026 at 09:00:00 IST (Asia/Kolkata)
 * 2. Registration Deadline: 01 September 2026 at 23:59:59 IST (Asia/Kolkata)
 */

export function initCountdown() {
  // Competition Date (03 Sep 2026 09:00 IST)
  const compTargetDate = new Date("2026-09-03T09:00:00+05:30").getTime();
  // Registration Deadline (01 Sep 2026 23:59:59 IST)
  const regTargetDate = new Date("2026-09-01T23:59:59+05:30").getTime();

  // Competition Elements
  const compDaysEl = document.getElementById("comp-days");
  const compHoursEl = document.getElementById("comp-hours");
  const compMinsEl = document.getElementById("comp-mins");
  const compSecsEl = document.getElementById("comp-secs");
  const compTickerEl = document.getElementById("comp-countdown-ticker");

  // Registration Elements
  const regDaysEl = document.getElementById("countdown-days");
  const regHoursEl = document.getElementById("countdown-hours");
  const regMinsEl = document.getElementById("countdown-minutes");
  const regSecsEl = document.getElementById("countdown-seconds");
  const bannerEl = document.getElementById("countdown-status-banner");
  const containerEl = document.getElementById("countdown-timer-container");

  function update() {
    const now = new Date().getTime();

    // 1. Update Competition Countdown (03 Sep 2026)
    const compDistance = compTargetDate - now;
    if (compDistance > 0) {
      const cDays = Math.floor(compDistance / (1000 * 60 * 60 * 24));
      const cHours = Math.floor((compDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const cMins = Math.floor((compDistance % (1000 * 60 * 60)) / (1000 * 60));
      const cSecs = Math.floor((compDistance % (1000 * 60)) / 1000);

      if (compDaysEl) compDaysEl.textContent = String(cDays).padStart(2, "0");
      if (compHoursEl) compHoursEl.textContent = String(cHours).padStart(2, "0");
      if (compMinsEl) compMinsEl.textContent = String(cMins).padStart(2, "0");
      if (compSecsEl) compSecsEl.textContent = String(cSecs).padStart(2, "0");
      if (compTickerEl) compTickerEl.textContent = `${cDays}d : ${String(cHours).padStart(2, "0")}h : ${String(cMins).padStart(2, "0")}m : ${String(cSecs).padStart(2, "0")}s`;
    } else {
      if (compTickerEl) compTickerEl.textContent = "ARENA LIVE // IN SESSION";
      if (compDaysEl) compDaysEl.textContent = "00";
      if (compHoursEl) compHoursEl.textContent = "00";
      if (compMinsEl) compMinsEl.textContent = "00";
      if (compSecsEl) compSecsEl.textContent = "00";
    }

    // 2. Update Registration Deadline Countdown (01 Sep 2026)
    const regDistance = regTargetDate - now;
    if (regDistance <= 0) {
      if (containerEl) containerEl.style.opacity = "0.6";
      if (bannerEl) {
        bannerEl.textContent = "REGISTRATION CLOSED // TARGET REACHED";
        bannerEl.classList.add("closed");
      }
      if (regDaysEl) regDaysEl.textContent = "00";
      if (regHoursEl) regHoursEl.textContent = "00";
      if (regMinsEl) regMinsEl.textContent = "00";
      if (regSecsEl) regSecsEl.textContent = "00";
    } else {
      const rDays = Math.floor(regDistance / (1000 * 60 * 60 * 24));
      const rHours = Math.floor((regDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const rMins = Math.floor((regDistance % (1000 * 60 * 60)) / (1000 * 60));
      const rSecs = Math.floor((regDistance % (1000 * 60)) / 1000);

      if (regDaysEl) regDaysEl.textContent = String(rDays).padStart(2, "0");
      if (regHoursEl) regHoursEl.textContent = String(rHours).padStart(2, "0");
      if (regMinsEl) regMinsEl.textContent = String(rMins).padStart(2, "0");
      if (regSecsEl) regSecsEl.textContent = String(rSecs).padStart(2, "0");
    }
  }

  update();
  const timer = setInterval(update, 1000);
  return timer;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCountdown);
} else {
  initCountdown();
}
