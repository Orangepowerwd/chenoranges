"use strict";

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');
const yearElement = document.querySelector("#year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

function setTheme(theme) {
  const isDark = theme === "dark";

  root.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀" : "☾";
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  if (themeColor) {
    themeColor.setAttribute("content", isDark ? "#1d1d20" : "#fff8ed");
  }
}

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("chen-theme");
} catch {
  // Storage may be disabled; the theme toggle still works for this page view.
}

const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : systemPrefersDark ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    try {
      localStorage.setItem("chen-theme", nextTheme);
    } catch {
      // Theme changes remain functional without persistent storage.
    }
  });
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  root.classList.add("js-motion");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -32px 0px"
  });

  document.querySelectorAll(".reveal").forEach((section) => {
    revealObserver.observe(section);
  });
}

reducedMotion.addEventListener?.("change", (event) => {
  if (event.matches) {
    root.classList.remove("js-motion");
    document.querySelectorAll(".reveal").forEach((section) => {
      section.classList.add("is-visible");
    });
  }
});
