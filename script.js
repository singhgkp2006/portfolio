const menuToggle = document.querySelector(".menu-toggle");
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

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (homeLink) {
  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (nav) {
      nav.classList.remove("open");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
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

/* --- Anti-copy / anti-download protections (best-effort) --- */
// Prevent keyboard copy and cut
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('cut', (e) => e.preventDefault());

// Prevent context menu (right-click / long-press)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Prevent text selection start
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

// Prevent dragging images to download
document.addEventListener('dragstart', (e) => {
  if (e.target && e.target.nodeName === 'IMG') {
    e.preventDefault();
  }
});

// Also block touch-and-hold callouts on iOS (best-effort via CSS already applied)

