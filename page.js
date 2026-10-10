const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");

menuToggle?.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
});

document.querySelectorAll(".desktop-nav a, .header-phone").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .14 });

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

const hero = document.querySelector(".hero");
const heroMedia = document.querySelector(".hero-media");
const heroContent = document.querySelector(".hero-content");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroFrame = 0;

function updateHeroMotion() {
  heroFrame = 0;
  if (reduceMotion.matches || !hero || window.scrollY > hero.offsetHeight) return;
  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
  heroMedia.style.transform = `translate3d(0, ${progress * 74}px, 0)`;
  heroContent.style.transform = `translate3d(0, ${progress * -38}px, 0)`;
  heroContent.style.opacity = String(1 - progress * .76);
}

window.addEventListener("scroll", () => {
  if (!heroFrame) heroFrame = requestAnimationFrame(updateHeroMotion);
}, { passive: true });

updateHeroMotion();

document.querySelectorAll('.footer-action[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
});
