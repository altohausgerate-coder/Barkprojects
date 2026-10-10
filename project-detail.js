const detailCopyByCategory = {
  "Otelçilik": "Bu layihədə qonaqpərvərlik məkanının funksional tələbləri ilə premium material seçimi bir araya gətirilib. Mebel, pərdə, jalüz və tekstil elementləri vahid vizual dil daxilində seçilərək ölçü, istehsal, çatdırılma və quraşdırma mərhələləri əlaqəli şəkildə idarə olunub.",
  "Qida və içki": "Restoran məkanının gündəlik intensiv istifadəsi nəzərə alınaraq davamlı materiallar, rahat mebel həlləri və interyeri tamamlayan tekstil elementləri seçilib. Təchizat və quraşdırma prosesi məkanın konsepsiyası ilə uyğun şəkildə həyata keçirilib.",
  "Dövlət və ictimai": "Layihənin rəsmi xarakterinə, təhlükəsizlik və davamlılıq tələblərinə uyğun mebel və tekstil həlləri hazırlanıb. Material seçimi, ölçüləndirmə və quraşdırma prosesi vahid keyfiyyət nəzarəti altında icra olunub.",
  "İnteryer": "Məkan üçün xüsusi ölçülərə uyğun pərdə, jalüz və tekstil həlləri seçilib. Rəng, faktura və işıq nəzarəti interyerin memarlıq dili ilə uyğunlaşdırılaraq istehsal və montaj mərhələləri tamamlanıb.",
  "Ticarət": "Yüksək ziyarətçi axını olan kommersiya məkanı üçün estetik görünüş, davamlılıq və rahat qulluq əsas götürülüb. Mebel və tekstil elementləri layihənin ümumi memarlıq konsepsiyasına uyğun təchiz edilib.",
  "Yaşayış": "Yaşayış məkanında rahatlıq, material keyfiyyəti və uzunmüddətli istifadə ön plana çıxarılıb. Fərdi mebel, yumşaq dekor və tekstil həlləri məkanın ölçülərinə və xarakterinə uyğunlaşdırılıb.",
  "İdman və ictimai": "İctimai istifadə üçün nəzərdə tutulan məkanda funksionallıq, möhkəmlik və təhlükəsizlik tələbləri əsas götürülüb. Təchizat elementləri intensiv istifadə şəraitinə uyğun seçilərək quraşdırılıb.",
  "İctimai məkan": "Məkanın funksional axını və istifadəçi rahatlığı nəzərə alınaraq mebel və tekstil həlləri seçilib. Layihənin təchizat mərhələləri ölçüdən son quraşdırmaya qədər koordinasiya olunub."
  ,"Təhsil": "Təhsil məkanının gündəlik intensiv istifadəsi nəzərə alınaraq təhlükəsiz, davamlı və çevik mebel həlləri hazırlanıb. Tədris, komanda işi və ümumi istifadə zonaları vahid funksional sistem daxilində tamamlanıb."
  ,"Ofis və maliyyə": "Korporativ iş axınına uyğun funksional mebel, qəbul və görüş zonaları, divar üzləmələri və saxlama sistemləri hazırlanıb. Material və detal seçimi davamlılıqla vahid brend görünüşünü birləşdirir."
};

function displayTitle(project) {
  if (project.id === 14) return "Port Baku Walk";
  if (project.id === 24) return "Hilton Garden Inn Baku Hotel";
  return project.title.replace(/^Pərdə və jalüz \| |^Pərdə və otel tekstili \| /, "");
}

function serviceTitle(project) {
  if (Array.isArray(project.scope) && project.scope.length) return project.scope.join(" · ");
  if (project.title.startsWith("Pərdə və jalüz |")) return "Pərdə və jalüz sistemləri";
  if (project.title.startsWith("Pərdə və otel tekstili |")) return "Pərdə və otel tekstili";
  if (project.id === 14) return "Motorlu jalüz sistemləri və mebel parçaları";
  if (project.id === 24) return "Yanğına davamlı pərdələr və mebel üçün dərilər";
  return "Mebel · tekstil · pərdə və jalüz";
}

function relatedImage(project, projects) {
  const clean = project.title.replace(/^Pərdə və jalüz \| |^Pərdə və otel tekstili \| /, "").toLocaleLowerCase("az");
  const related = projects.find((item) => item.id !== project.id && (
    item.title.toLocaleLowerCase("az").includes(clean) || clean.includes(item.title.toLocaleLowerCase("az"))
  ));
  return related?.image || project.image;
}

function setProject(project, projects) {
  const index = projects.findIndex((item) => item.id === project.id);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const description = project.description || detailCopyByCategory[project.category] || detailCopyByCategory["İnteryer"];

  const title = displayTitle(project);
  document.title = `${title} — BARK PROJECTS`;
  document.querySelector('meta[name="description"]').content = `${title}, ${project.location} — BARK PROJECTS layihə təqdimatı.`;
  document.querySelector("#detail-title").textContent = title;
  document.querySelector("#detail-heading").textContent = title;
  document.querySelector("#detail-category").textContent = project.category;
  document.querySelector("#detail-location").textContent = `${project.location}, Azərbaycan`;
  document.querySelector("#detail-description").textContent = description;
  document.querySelector("#fact-location").textContent = `${project.location}, Azərbaycan`;
  document.querySelector("#fact-category").textContent = project.category;
  document.querySelector("#fact-scope").textContent = serviceTitle(project);
  const catalogFact = document.querySelector("#fact-catalog-row");
  if (project.catalogPages) {
    catalogFact.hidden = false;
    document.querySelector("#fact-catalog").textContent = `BARK PROJECTS · səh. ${project.catalogPages}`;
  } else {
    catalogFact.hidden = true;
  }

  const hero = document.querySelector("#detail-image");
  hero.src = project.image;
  hero.alt = project.alt || title;
  hero.dataset.galleryIndex = "0";
  const secondary = document.querySelector("#detail-image-secondary");
  secondary.src = project.secondaryImage || relatedImage(project, projects);
  secondary.alt = `${title} layihəsindən görüntü`;
  secondary.dataset.galleryIndex = "1";

  const prevLink = document.querySelector("#project-prev");
  prevLink.href = `project.html?id=${encodeURIComponent(previous.id)}`;
  prevLink.querySelector("strong").textContent = displayTitle(previous);
  const nextLink = document.querySelector("#project-next");
  nextLink.href = `project.html?id=${encodeURIComponent(next.id)}`;
  nextLink.querySelector("strong").textContent = displayTitle(next);
}

const detailLightbox = document.querySelector("#detail-lightbox");
const detailLightboxImage = document.querySelector("#detail-lightbox-image");
let detailLightboxIndex = 0;

function updateDetailLightbox(step = 0) {
  const sourceImages = [document.querySelector("#detail-image"), document.querySelector("#detail-image-secondary")];
  const imageSources = sourceImages.map((image) => image.currentSrc || image.src).filter(Boolean);
  if (!imageSources.length) return;
  detailLightboxIndex = (detailLightboxIndex + step + imageSources.length) % imageSources.length;
  const source = sourceImages[detailLightboxIndex];
  const title = document.querySelector("#detail-title").textContent;
  const count = document.querySelector("#detail-lightbox-count");
  document.querySelector("#detail-lightbox-title").textContent = title;
  count.textContent = `${String(detailLightboxIndex + 1).padStart(2, "0")} / ${String(imageSources.length).padStart(2, "0")}`;
  detailLightboxImage.classList.remove("is-visible");
  detailLightboxImage.alt = source.alt;
  detailLightboxImage.onload = () => requestAnimationFrame(() => detailLightboxImage.classList.add("is-visible"));
  detailLightboxImage.src = imageSources[detailLightboxIndex];
  if (detailLightboxImage.complete) requestAnimationFrame(() => detailLightboxImage.classList.add("is-visible"));
}

function openDetailLightbox(index) {
  detailLightboxIndex = index;
  updateDetailLightbox();
  if (!detailLightbox.open) detailLightbox.showModal();
}

document.querySelectorAll("#detail-image, #detail-image-secondary").forEach((image) => {
  image.addEventListener("click", () => openDetailLightbox(Number(image.dataset.galleryIndex || 0)));
  image.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openDetailLightbox(Number(image.dataset.galleryIndex || 0));
  });
});
document.querySelector("#detail-lightbox .dialog-close").addEventListener("click", () => detailLightbox.close());
document.querySelector(".detail-lightbox-prev").addEventListener("click", () => updateDetailLightbox(-1));
document.querySelector(".detail-lightbox-next").addEventListener("click", () => updateDetailLightbox(1));
detailLightbox.addEventListener("click", (event) => {
  if (event.target === detailLightbox) detailLightbox.close();
});
detailLightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") updateDetailLightbox(-1);
  if (event.key === "ArrowRight") updateDetailLightbox(1);
});

fetch("projects.json")
  .then((response) => response.json())
  .then((projects) => {
    const requestedId = Number(new URLSearchParams(window.location.search).get("id"));
    const project = projects.find((item) => item.id === requestedId) || projects[0];
    setProject(project, projects);
  })
  .catch(() => {
    document.querySelector("#detail-title").textContent = "Layihə tapılmadı";
    document.querySelector("#detail-description").textContent = "Layihə məlumatını yükləmək mümkün olmadı.";
  });
