const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQ9cqSHM6edDl_2CyFsmhv1xGOS53O_5vgj8Gi7rtUfHXb_udIiJPsIEn-65iKkIQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  attachNewsletterFormHandler();
  attachContactFormHandler();
});

function attachNewsletterFormHandler() {
  const newsletterForm = document.querySelector(".newsletter_form");

  if (!newsletterForm) {
    return;
  }

  const emailInput = newsletterForm.querySelector('input[name="email"]');
  const formContainer = newsletterForm.closest(".w-form");
  const successDiv = formContainer ? formContainer.querySelector(".w-form-done") : null;
  const errorDiv = formContainer ? formContainer.querySelector(".w-form-fail") : null;

  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = (emailInput ? emailInput.value : "").trim();

    clearMessage(errorDiv);

    if (!isValidEmail(email)) {
      showError(errorDiv, "Please enter a valid email.");
      return;
    }

    try {
      const response = await postFormPayload({
        form: "newsletter",
        email,
        form_source: "newsletter",
        page_url: window.location.href
      });

      if (!response.ok) {
        const data = await safeJson(response);
        showError(errorDiv, data.error || "Submission failed.");
        return;
      }

      newsletterForm.style.display = "none";
      if (successDiv) {
        successDiv.style.display = "block";
      }
    } catch (error) {
      showError(errorDiv, getSubmissionErrorMessage(error));
    }
  });
}

function attachContactFormHandler() {
  const contactForm = document.querySelector(".form_wrap");

  if (!contactForm) {
    return;
  }

  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const messageInput = contactForm.querySelector('textarea[name="field"]');
  const privacyCheckbox = contactForm.querySelector('input[name="consent-contact-response"]');
  const marketingCheckbox = contactForm.querySelector('input[name="consent-contact-newsletter"]');

  const formContainer = contactForm.closest(".w-form");
  const successDiv = formContainer ? formContainer.querySelector(".w-form-done") : null;
  const errorDiv = formContainer ? formContainer.querySelector(".w-form-fail") : null;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = (nameInput ? nameInput.value : "").trim();
    const email = (emailInput ? emailInput.value : "").trim();
    const message = (messageInput ? messageInput.value : "").trim();
    const consent_privacy = Boolean(privacyCheckbox && privacyCheckbox.checked);
    const consent_marketing = Boolean(marketingCheckbox && marketingCheckbox.checked);

    clearMessage(errorDiv);

    if (!name) {
      showError(errorDiv, "Please enter your name.");
      return;
    }

    if (!isValidEmail(email)) {
      showError(errorDiv, "Please enter a valid email.");
      return;
    }

    if (!message) {
      showError(errorDiv, "Please enter your message.");
      return;
    }

    if (!consent_privacy) {
      showError(errorDiv, "You must accept the privacy consent.");
      return;
    }

    try {
      const response = await postFormPayload({
        form: "contact",
        name,
        email,
        message,
        consent_privacy,
        consent_marketing,
        form_source: "contact",
        page_url: window.location.href
      });

      if (!response.ok) {
        const data = await safeJson(response);
        showError(errorDiv, data.error || "Submission failed.");
        return;
      }

      contactForm.style.display = "none";
      if (successDiv) {
        successDiv.style.display = "block";
      }
    } catch (error) {
      showError(errorDiv, getSubmissionErrorMessage(error));
    }
  });
}

function postFormPayload(payload) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "PASTE_YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE") {
    return Promise.reject(new Error("Google Apps Script URL is not configured."));
  }

  return fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function getSubmissionErrorMessage(error) {
  if (error && error.message === "Google Apps Script URL is not configured.") {
    return "Google Apps Script URL is not configured yet.";
  }

  return "Network error. Please try again later.";
}

function showError(errorElement, message) {
  if (!errorElement) {
    return;
  }

  const messageNode = errorElement.querySelector("div");

  if (messageNode) {
    messageNode.textContent = message;
  } else {
    errorElement.textContent = message;
  }

  errorElement.style.display = "block";
}

function clearMessage(errorElement) {
  if (!errorElement) {
    return;
  }

  errorElement.style.display = "none";
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}