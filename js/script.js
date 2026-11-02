
"use strict";

// ===== CONFIGURATION =====

// Enter a real number with country code, digits only.
// Example format: 91 followed by a valid Indian mobile number.
// Leave empty to disable WhatsApp in the demo.
const WHATSAPP_NUMBER = "";

// Get your endpoint from https://formspree.io/
// Example format: https://formspree.io/f/yourFormId
// Leave empty until you have configured Formspree.
const FORM_ENDPOINT = "";

// ===== COPYRIGHT YEAR =====

const yearElement = document.getElementById("year");
yearElement.textContent = new Date().getFullYear();

// ===== MOBILE NAVIGATION =====

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// ===== WHATSAPP =====

const whatsappLink = document.getElementById("whatsapp-link");

if (/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
  const message = encodeURIComponent(
    "Hello, I would like to enquire about your restaurant menu."
  );

  whatsappLink.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.removeAttribute("aria-disabled");
}

whatsappLink.addEventListener("click", (event) => {
  if (whatsappLink.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
  }
});

// ===== CONTACT FORM =====

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!FORM_ENDPOINT) {
    formStatus.textContent =
      "Demo mode: Contact form is not configured yet.";
    return;
  }

  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(FORM_ENDPOINT)) {
    formStatus.textContent = "Invalid form configuration.";
    return;
  }

  if (!contactForm.reportValidity()) return;

  submitButton.disabled = true;
  formStatus.textContent = "Sending your enquiry...";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    formStatus.textContent =
      "Your enquiry was sent successfully!";
    contactForm.reset();

  } catch (error) {
    console.error("Contact form error:", error);
    formStatus.textContent =
      "Unable to send. Please try again later.";
  } finally {
    submitButton.disabled = false;
  }
});
