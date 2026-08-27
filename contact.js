/**
 * ROBO KRITI 2026 - CONTACT & HELP DESK MODULE
 */
import { submitHelpForm } from './firebase.js';
import { playTechSound } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-help-form');
  const statusMsg = document.getElementById('help-status-msg');
  const submitBtn = document.getElementById('submitHelpBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById('helpName').value.trim(),
        email: document.getElementById('helpEmail').value.trim(),
        phone: document.getElementById('helpPhone')?.value.trim() || 'N/A',
        event: document.getElementById('helpEvent').value,
        subject: document.getElementById('helpSubject').value.trim(),
        message: document.getElementById('helpMessage').value.trim()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING QUERY...';
      }

      try {
        const ticket = await submitHelpForm(data);
        playTechSound('success');

        if (statusMsg) {
          statusMsg.className = 'help-status-msg success';
          statusMsg.innerHTML = `
            <strong>TRANSMISSION RECEIVED</strong><br>
            Your query has been logged under Signal ID <code>${ticket.ticketId}</code>. An operations coordinator from the Tinkering & Robotics Lab will respond shortly.
          `;
          statusMsg.style.display = 'block';
        }

        form.reset();
      } catch (err) {
        alert('Transmission failed. Please check network telemetry.');
        console.error(err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT MESSAGE →';
        }
      }
    });
  }
});
