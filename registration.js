/**
 * ROBO KRITI 2026 - REGISTRATION ENGINE
 * Functional validation, Firebase RTDB submission & ID generation
 */
import { submitRegistration } from './firebase.js';
import { playTechSound } from './main.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const sizeSelect = document.getElementById('teamSize');
  const membersGroup = document.getElementById('teamMembersGroup');
  const successModal = document.getElementById('regSuccessModal');
  const regIdDisplay = document.getElementById('generatedRegId');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const printPassBtn = document.getElementById('printPassBtn');
  const submitBtn = document.getElementById('submitRegBtn');

  // Dynamic team member inputs based on team size
  if (sizeSelect && membersGroup) {
    sizeSelect.addEventListener('change', () => {
      const size = parseInt(sizeSelect.value, 10);
      if (size > 1) {
        membersGroup.style.display = 'block';
      } else {
        membersGroup.style.display = 'none';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const eventMap = {
        'Robo Race': 'RACE',
        'Robo War': 'WAR',
        'Robo Tug of War': 'TUG',
        'Robo Soccer': 'SOCCER'
      };

      const selectedEvent = document.getElementById('eventSelect').value;
      const eventCode = eventMap[selectedEvent] || 'REG';

      const formData = {
        teamName: document.getElementById('teamName').value.trim(),
        classGrade: document.getElementById('classGrade').value.trim(),
        section: document.getElementById('section').value.trim(),
        school: document.getElementById('school').value.trim() || 'Army Public School, Lucknow',
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        teamSize: document.getElementById('teamSize').value,
        event: selectedEvent,
        eventCode: eventCode,
        teamMembers: document.getElementById('teamMembers')?.value.trim() || 'N/A',
        mentorName: document.getElementById('mentorName')?.value.trim() || 'N/A',
        additionalInfo: document.getElementById('additionalInfo')?.value.trim() || 'N/A'
      };

      // Disable button during transmission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING PROTOCOL...';
      }

      try {
        const result = await submitRegistration(formData);
        
        // Show success modal
        if (regIdDisplay) {
          regIdDisplay.textContent = result.regId;
        }
        if (successModal) {
          successModal.style.display = 'flex';
        }

        playTechSound('success');

        // Confetti explosion
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#ff5e00', '#ffffff', '#00ff66']
          });
        } catch (e) {}

        form.reset();
      } catch (err) {
        alert('Transmission error. Please check your signal and try again.');
        console.error(err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT REGISTRATION PROTOCOL →';
        }
      }
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.style.display = 'none';
    });
  }

  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
