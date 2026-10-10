const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

function closeMenu(returnFocus = false) {
  if (!siteHeader?.classList.contains("menu-open")) return;
  siteHeader.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Menyunu aç");
  if (returnFocus) menuToggle?.focus();
}

menuToggle?.addEventListener("click", () => {
  const open = siteHeader.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
});

document.querySelectorAll(".desktop-nav a, .header-phone").forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu(true);
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" })
  : null;

function observeReveals(root = document) {
  root.querySelectorAll?.("[data-reveal-stagger]").forEach((group) => {
    [...group.children].forEach((item, index) => {
      item.setAttribute("data-reveal", "");
      item.style.setProperty("--reveal-delay", `${(index % 5) * 45}ms`);
    });
  });
  const items = root.matches?.("[data-reveal]")
    ? [root, ...root.querySelectorAll("[data-reveal]")]
    : root.querySelectorAll("[data-reveal]");
  items.forEach((item) => {
    if (reduceMotion.matches || !revealObserver) item.classList.add("is-visible");
    else revealObserver.observe(item);
  });
}

document.querySelectorAll(".site-footer .footer-column, .site-footer .footer-bottom").forEach((item) => item.setAttribute("data-reveal", ""));
document.querySelectorAll(".detail-facts, .detail-pagination").forEach((item) => item.setAttribute("data-reveal-stagger", ""));
observeReveals();

window.BarkMotion = { observeReveals };

const hero = document.querySelector(".hero");
const heroSlides = hero ? [...hero.querySelectorAll(".hero-slide")] : [];
const heroSlideDetails = [
  { image: "assets/hero/bark-home-hero.webp", label: "BARK PROJECTS" },
  { image: "assets/projects/web/ritz.webp", label: "THE RITZ-CARLTON HOTEL" },
  { image: "assets/projects/web/porttower.webp", label: "PORT BAKU TOWER 2" },
  { image: "assets/projects/web/seabreeze.webp", label: "SEA BREEZE GRAND HOTEL" },
  { image: "assets/projects/web/crescent.webp", label: "CRESCENT MALL" },
  { image: "assets/projects/web/marriott.webp", label: "MARRIOTT HOTEL BOULEVARD" },
  { image: "assets/projects/web/lachin.webp", label: "LACHIN RESORT & SPA" },
];
let heroSlideIndex = 0;
let activeHeroLayer = 0;
let heroTimer = 0;
let heroPaused = false;

function syncHeroControls() {
  const caption = document.querySelector("#hero-slide-caption");
  if (caption) caption.textContent = `${heroSlideDetails[heroSlideIndex].label} · ${String(heroSlideIndex + 1).padStart(2, "0")}`;
  document.querySelectorAll("[data-hero-index]").forEach((button, index) => {
    if (index === heroSlideIndex) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

function stopHeroTimer() {
  window.clearTimeout(heroTimer);
  heroTimer = 0;
}

function startHeroTimer() {
  stopHeroTimer();
  if (!heroSlides.length || reduceMotion.matches || heroPaused || document.hidden) return;
  heroTimer = window.setTimeout(() => showHeroSlide(heroSlideIndex + 1), 6500);
}

function showHeroSlide(index) {
  if (heroSlides.length < 2) return;
  heroSlideIndex = (index + heroSlideDetails.length) % heroSlideDetails.length;
  const nextLayerIndex = 1 - activeHeroLayer;
  const nextLayer = heroSlides[nextLayerIndex];
  const detail = heroSlideDetails[heroSlideIndex];
  stopHeroTimer();

  const revealNextLayer = () => {
    nextLayer.classList.add("is-active");
    heroSlides[activeHeroLayer].classList.remove("is-active");
    activeHeroLayer = nextLayerIndex;
    syncHeroControls();
    startHeroTimer();
  };

  if (nextLayer.getAttribute("src") === detail.image) {
    requestAnimationFrame(revealNextLayer);
    return;
  }

  const preload = new Image();
  preload.onload = () => {
    nextLayer.src = detail.image;
    requestAnimationFrame(revealNextLayer);
  };
  preload.onerror = startHeroTimer;
  preload.src = detail.image;
}

document.querySelectorAll("[data-hero-index]").forEach((button) => button.addEventListener("click", () => showHeroSlide(Number(button.dataset.heroIndex))));
document.querySelectorAll("[data-hero-step]").forEach((button) => button.addEventListener("click", () => showHeroSlide(heroSlideIndex + Number(button.dataset.heroStep))));
hero?.addEventListener("pointerenter", () => { heroPaused = true; stopHeroTimer(); });
hero?.addEventListener("pointerleave", () => { heroPaused = false; startHeroTimer(); });
hero?.addEventListener("focusin", () => { heroPaused = true; stopHeroTimer(); });
hero?.addEventListener("focusout", (event) => {
  if (!hero.contains(event.relatedTarget)) { heroPaused = hero.matches(":hover"); startHeroTimer(); }
});
document.addEventListener("visibilitychange", startHeroTimer);
window.addEventListener("keydown", (event) => {
  if (!hero || !hero.contains(document.activeElement)) return;
  if (event.key === "ArrowLeft") showHeroSlide(heroSlideIndex - 1);
  if (event.key === "ArrowRight") showHeroSlide(heroSlideIndex + 1);
});
syncHeroControls();
startHeroTimer();

const parallaxLayers = [
  [".hero", ".hero-media", 68],
  [".detail-hero", ".detail-hero > img", 56],
  [".corporate-hero", ".corporate-hero > img", 58],
  [".corporate-cta", ".corporate-cta > img", 42],
];
let motionFrame = 0;

function updateScrollMotion() {
  motionFrame = 0;
  if (reduceMotion.matches) return;

  for (const [sectionSelector, layerSelector, distance] of parallaxLayers) {
    const section = document.querySelector(sectionSelector);
    const layer = document.querySelector(layerSelector);
    if (!section || !layer) continue;

    const bounds = section.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) continue;
    const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(bounds.height, 1)));
    layer.style.setProperty("--scroll-parallax-y", `${progress * distance}px`);
    if (sectionSelector === ".hero") {
      const content = section.querySelector(".hero-content");
      content?.style.setProperty("--scroll-hero-opacity", String(1 - progress * 0.68));
      content?.style.setProperty("--scroll-hero-y", `${progress * -34}px`);
    }
  }
}

window.addEventListener("scroll", () => {
  if (!motionFrame) motionFrame = requestAnimationFrame(updateScrollMotion);
}, { passive: true });
window.addEventListener("resize", () => {
  if (!motionFrame) motionFrame = requestAnimationFrame(updateScrollMotion);
}, { passive: true });
reduceMotion.addEventListener?.("change", () => {
  if (reduceMotion.matches) {
    stopHeroTimer();
    document.querySelectorAll("[style*=scroll-parallax-y]").forEach((item) => item.style.removeProperty("--scroll-parallax-y"));
    document.querySelectorAll(".hero-content").forEach((item) => {
      item.style.removeProperty("--scroll-hero-opacity");
      item.style.removeProperty("--scroll-hero-y");
    });
  } else {
    updateScrollMotion();
    startHeroTimer();
  }
});
updateScrollMotion();
