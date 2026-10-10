const filterOrder = ["Hamısı", "Otelçilik", "Qida və içki", "Dövlət və ictimai", "Təhsil", "Ofis və maliyyə", "İnteryer", "Ticarət", "Yaşayış", "İdman və ictimai", "İctimai məkan"];
const grid = document.querySelector("#project-grid");
const filterRoot = document.querySelector("#filters");
const search = document.querySelector("#search");
const empty = document.querySelector("#empty-state");
const dialog = document.querySelector("#project-dialog");
let projects = [];
let activeFilter = "Hamısı";
let visibleProjects = [];
let currentProjectIndex = 0;

function projectDisplayTitle(project) {
  if (project.id === 14) return "Port Baku Walk";
  if (project.id === 24) return "Hilton Garden Inn Baku Hotel";
  return project.title.replace(/^Pərdə və jalüz \| |^Pərdə və otel tekstili \| /, "");
}

function makeFilters() {
  if (!filterRoot) return;
  const existing = new Set(projects.map((project) => project.category));
  const ordered = filterOrder.slice(1).filter((label) => existing.has(label));
  const categories = ["Hamısı", ...ordered];
  filterRoot.replaceChildren(...categories.map((label, index) => {
    const button = document.createElement("button");
    button.className = `filter-button${index === 0 ? " active" : ""}`;
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(index === 0));
    button.addEventListener("click", () => {
      activeFilter = label;
      filterRoot.querySelectorAll("button").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    });
    return button;
  }));
}

function render() {
  const term = search ? search.value.trim().toLocaleLowerCase("az") : "";
  const visible = projects.filter((project) => {
    const matchesCategory = activeFilter === "Hamısı" || project.category === activeFilter;
    const searchable = `${project.title} ${project.category} ${project.location}`.toLocaleLowerCase("az");
    return matchesCategory && searchable.includes(term);
  });
  visibleProjects = visible;
  const cards = visible.map((project, index) => {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = `project.html?id=${encodeURIComponent(project.id)}`;
    card.setAttribute("aria-label", `${projectDisplayTitle(project)}, ${project.location}`);
    card.style.animationDelay = `${Math.min(index, 10) * 55}ms`;

    const picture = document.createElement("div");
    picture.className = "project-image";
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.alt || `${project.title} layihəsinin fotosu`;
    image.loading = index < 3 ? "eager" : "lazy";
    image.decoding = "async";
    picture.append(image);

    const caption = document.createElement("div");
    caption.className = "project-caption";
    const copy = document.createElement("div");
    const name = document.createElement("h3");
    name.className = "project-name";
    name.textContent = projectDisplayTitle(project);
    const meta = document.createElement("p");
    meta.className = "project-meta";
    meta.textContent = `${project.location} · ${project.category}`;
    copy.append(name, meta);
    caption.append(copy);
    picture.append(caption);
    card.append(picture);

    return card;
  });
  const columnCount = window.innerWidth > 1050 ? 3 : window.innerWidth > 680 ? 2 : 1;
  const columns = Array.from({ length: columnCount }, () => {
    const column = document.createElement("div");
    column.className = "project-column";
    return column;
  });
  cards.forEach((card, index) => columns[index % columnCount].append(card));
  grid.replaceChildren(...columns);
  empty.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
}

function showProject(project) {
  currentProjectIndex = Math.max(0, visibleProjects.findIndex((item) => item.id === project.id));
  const image = document.querySelector("#dialog-image");
  image.src = project.image;
  image.alt = project.alt || `${project.title} layihəsinin fotosu`;
  document.querySelector("#dialog-category").textContent = project.category;
  document.querySelector("#dialog-title").textContent = project.title;
  document.querySelector("#dialog-location").textContent = project.location;
  document.querySelector("#dialog-count").textContent = `${String(currentProjectIndex + 1).padStart(2, "0")} / ${String(visibleProjects.length).padStart(2, "0")}`;
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = "hidden";
}

function moveProject(step) {
  if (!visibleProjects.length) return;
  currentProjectIndex = (currentProjectIndex + step + visibleProjects.length) % visibleProjects.length;
  showProject(visibleProjects[currentProjectIndex]);
}

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.querySelector(".dialog-prev").addEventListener("click", () => moveProject(-1));
document.querySelector(".dialog-next").addEventListener("click", () => moveProject(1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") moveProject(-1);
  if (event.key === "ArrowRight") moveProject(1);
});
search?.addEventListener("input", render);

let lastColumnCount = window.innerWidth > 1050 ? 3 : window.innerWidth > 680 ? 2 : 1;
window.addEventListener("resize", () => {
  const nextColumnCount = window.innerWidth > 1050 ? 3 : window.innerWidth > 680 ? 2 : 1;
  if (nextColumnCount !== lastColumnCount) {
    lastColumnCount = nextColumnCount;
    render();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const open = document.querySelector(".site-header").classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
});
document.querySelectorAll(".desktop-nav a, .header-phone").forEach((link) => link.addEventListener("click", () => {
  document.querySelector(".site-header").classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", () => {
  document.querySelector(".desktop-nav .active")?.classList.remove("active");
  document.querySelector(`.desktop-nav a[href="${link.getAttribute("href")}"]`)?.classList.add("active");
}));

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

fetch("projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Project catalogue could not be loaded");
    return response.json();
  })
  .then((data) => {
    projects = data;
    makeFilters();
    render();
  })
  .catch(() => {
    empty.hidden = false;
    empty.textContent = "Layihə kataloqu yüklənmədi. Səhifəni yeniləyin.";
  });
