document.addEventListener('DOMContentLoaded', () => {
  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter_form');
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('input[name="email"]');
    const successDiv = newsletterForm.querySelector('.w-form-done');
    const errorDiv = newsletterForm.querySelector('.w-form-fail');
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email.';
          errorDiv.style.display = 'block';
        }
        return;
      }
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (res.ok) {
          // Show success, hide form
          newsletterForm.style.display = 'none';
          if (successDiv) successDiv.style.display = 'block';
        } else {
          const data = await res.json().catch(() => ({}));
          if (errorDiv) {
            errorDiv.textContent = data.message || 'Submission failed.';
            errorDiv.style.display = 'block';
          }
        }
      } catch (err) {
        if (errorDiv) {
          errorDiv.textContent = 'Network error. Please try again later.';
          errorDiv.style.display = 'block';
        }
      }
    });
  }

  // Contact form submission
  const contactForm = document.querySelector('.form_wrap');
  if (contactForm) {
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput2 = contactForm.querySelector('input[name="email"]');
    const messageInput = contactForm.querySelector('textarea');
    const privacyCheckbox = contactForm.querySelector('input[name="consent-contact-response"]');
    const marketingCheckbox = contactForm.querySelector('input[name="consent-contact-newsletter"]');
    const successDiv2 = contactForm.querySelector('.w-form-done');
    const errorDiv2 = contactForm.querySelector('.w-form-fail');
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput2 ? emailInput2.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const consentPrivacy = privacyCheckbox ? privacyCheckbox.checked : false;
      const consentMarketing = marketingCheckbox ? marketingCheckbox.checked : false;
      if (!consentPrivacy) {
        if (errorDiv2) {
          errorDiv2.textContent = 'You must accept the privacy consent.';
          errorDiv2.style.display = 'block';
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorDiv2) {
          errorDiv2.textContent = 'Please enter a valid email.';
          errorDiv2.style.display = 'block';
        }
        return;
      }
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            message,
            consentPrivacy,
            consentMarketing
          })
        });
        if (res.ok) {
          contactForm.style.display = 'none';
          if (successDiv2) successDiv2.style.display = 'block';
        } else {
          const data = await res.json().catch(() => ({}));
          if (errorDiv2) {
            errorDiv2.textContent = data.message || 'Submission failed.';
            errorDiv2.style.display = 'block';
          }
        }
      } catch (err) {
        if (errorDiv2) {
          errorDiv2.textContent = 'Network error. Please try again later.';
          errorDiv2.style.display = 'block';
        }
      }
    });
  }
});
