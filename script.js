// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Web3Forms submission handler — works for any form with a matching status box
  function wireForm(formId, statusId, successMsg) {
    const form = document.getElementById(formId);
    if (!form) return;
    const statusBox = document.getElementById(statusId);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      statusBox.classList.remove('show', 'ok', 'err');

      try {
        const formData = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        const result = await res.json();

        if (result.success) {
          statusBox.textContent = successMsg;
          statusBox.classList.add('show', 'ok');
          form.reset();
        } else {
          statusBox.textContent = '> error :: could not send. Please email support@xorynex.com directly.';
          statusBox.classList.add('show', 'err');
        }
      } catch (err) {
        statusBox.textContent = '> error :: connection failed. Please email support@xorynex.com directly.';
        statusBox.classList.add('show', 'err');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  wireForm('contact-form', 'form-status', '> message_received :: I\'ll reply within one business day.');
  wireForm('feedback-form', 'feedback-status', '> feedback_received :: thank you for sharing your experience.');
});
