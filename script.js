const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const homeLink = document.querySelector(".logo");
const themeToggle = document.querySelector("[data-theme-toggle]");
const storageKey = "portfolio-theme";

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    // reflect icon state
    themeToggle.classList.toggle('is-dark', theme === 'dark');
  }
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
    // restart rotation animation: remove then force reflow then add
    themeToggle.classList.remove('rotating');
    // trigger reflow to restart animation reliably
    // eslint-disable-next-line no-unused-expressions
    themeToggle.offsetWidth;
    themeToggle.classList.add('rotating');
    const cleanup = () => themeToggle.classList.remove('rotating');
    themeToggle.addEventListener('animationend', cleanup, { once: true });
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // anchor navigation is handled naturally by the browser
  });
});

if (homeLink) {
  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((section) => {
  observer.observe(section);
});

// Logo bobbing removed — no runtime overrides applied.

// Prevent browser from restoring previous scroll on refresh/navigation
try {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
} catch (err) {
  // ignore
}

// Ensure the page is scrolled to the very top on load and when restored from bfcache.
const ensureTopOnLoad = () => {
  try {
    window.scrollTo(0, 0);
  } catch (e) {
    // ignore
  }
};

window.addEventListener('pageshow', (e) => {
  // if page is restored from bfcache or navigation history, reset scroll
  if (e.persisted) {
    ensureTopOnLoad();
  }
  // also schedule a microtask to cover other restore timings
  setTimeout(ensureTopOnLoad, 0);
});

window.addEventListener('load', () => {
  setTimeout(ensureTopOnLoad, 0);
});
// Note: previous aggressive anti-copy handlers were removed to preserve
// native browser features (selection, context menu, keyboard shortcuts).
// We keep protections non-intrusive (CSS watermark over profile image).

// --- Scoped copy/download protections ---
// Prevent copying from elements marked with `.no-copy` and intercept
// image drag / contextmenu on the profile photo + overlay.

document.addEventListener('copy', (e) => {
  try {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed) return;
    let node = sel.anchorNode;
    // if text node, get parent element
    if (node && node.nodeType === 3) node = node.parentElement;
    while (node) {
      if (node.classList && node.classList.contains('no-copy')) {
        e.preventDefault();
        // brief visual feedback
        node.classList.add('flash');
        setTimeout(() => node.classList.remove('flash'), 300);
        return;
      }
      node = node.parentElement;
    }
  } catch (err) {
    // fail silently
  }
});

// Profile photo protections
const profileImg = document.querySelector('.profile-photo');
const imgOverlay = document.querySelector('.img-protect');
if (profileImg) {
  profileImg.setAttribute('draggable', 'false');
  profileImg.addEventListener('dragstart', (ev) => ev.preventDefault());
  profileImg.addEventListener('contextmenu', (ev) => ev.preventDefault());
}
if (imgOverlay) {
  imgOverlay.addEventListener('contextmenu', (ev) => ev.preventDefault());
  imgOverlay.addEventListener('dragstart', (ev) => ev.preventDefault());
  // also intercept right-click (mouse) down before native menu
  imgOverlay.addEventListener('mousedown', (ev) => {
    if (ev.button === 2) ev.preventDefault();
  });
}

