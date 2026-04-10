const navCard = document.getElementById("siteNav");
const menuToggleButton = document.getElementById("openMenu");
const menuPanel = document.getElementById("menuPanel");
const closeTargets = document.querySelectorAll("[data-close-menu]");
const siteHeader = document.querySelector(".site-header");

let lastScrollY = window.scrollY;
let ticking = false;

if (!navCard || !menuToggleButton || !menuPanel) {
  throw new Error("Navigation elements were not found on the page.");
}

function isMenuOpen() {
  return navCard.classList.contains("is-open");
}

function setExpandedState(isExpanded) {
  menuToggleButton.setAttribute("aria-expanded", String(isExpanded));
  menuToggleButton.setAttribute(
    "aria-label",
    isExpanded ? "Close menu" : "Open menu"
  );
}

function openMenu() {
  if (isMenuOpen()) {
    return;
  }

  navCard.classList.add("is-open");
  setExpandedState(true);
}

function closeMenu() {
  if (!isMenuOpen()) {
    return;
  }

  navCard.classList.remove("is-open");
  setExpandedState(false);
}

function toggleMenu() {
  if (isMenuOpen()) {
    closeMenu();
    return;
  }

  openMenu();
}

function updateHeaderVisibility() {
  if (!siteHeader) {
    return;
  }

  const currentScrollY = window.scrollY;
  const scrolledDown = currentScrollY > lastScrollY;
  const passedThreshold = currentScrollY > 120;

  if (!isMenuOpen() && scrolledDown && passedThreshold) {
    siteHeader.classList.add("is-hidden");
  } else {
    siteHeader.classList.remove("is-hidden");
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

function handleScroll() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(updateHeaderVisibility);
}

menuToggleButton.addEventListener("click", toggleMenu);

closeTargets.forEach((element) => {
  element.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", handleScroll, { passive: true });

setExpandedState(false);
