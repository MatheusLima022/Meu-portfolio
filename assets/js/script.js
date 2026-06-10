const progressBar = document.getElementById("progressBar");
const header = document.getElementById("siteHeader") || document.querySelector(".site-header");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const revealElements = document.querySelectorAll(".reveal");
const parallaxElements = document.querySelectorAll(".parallax");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (header) header.classList.toggle("scrolled", scrollTop > 24);
}

function updateParallax() {
  parallaxElements.forEach((element) => {
    const speed = Number(element.dataset.speed || 0.12);
    const offset = window.scrollY * speed;
    element.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -70px 0px"
});

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 80}ms`;
  revealObserver.observe(element);
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateProgress();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

updateProgress();
updateParallax();
