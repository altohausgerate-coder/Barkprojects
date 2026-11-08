const grid = document.querySelector("#recommendation-pages");
const empty = document.querySelector("#recommendations-empty");

const letters = [
  { name: "Real-İnşaat MMC", file: "memorial", alt: "Real-İnşaat MMC-nin Gəncə Memorial Kompleksi üzrə tövsiyə məktubu" },
  { name: "KDY Logistics AZ MMC", file: "riverside", alt: "KDY Logistics AZ MMC-nin Riverside Hotel Ağdərə üzrə tövsiyə məktubu" },
  { name: "ABICON MMC", file: "generic", alt: "ABICON MMC-nin tövsiyə məktubu" },
  { name: "Azərbaycan Beynəlxalq Bankı", file: "abb", alt: "Azərbaycan Beynəlxalq Bankının tövsiyə məktubu" },
  { name: "EPISOM MMC", file: "episom", alt: "EPISOM MMC-nin tövsiyə məktubu" },
  { name: "Kucha MMC", file: "kucha", alt: "Kucha MMC-nin tövsiyə məktubu" },
  { name: "Macara Club MMC", file: "macara", alt: "Macara Club MMC-nin tövsiyə məktubu" },
  { name: "Olimp Mühəndis Xidmətləri MMC", file: "olimp", alt: "Olimp Mühəndis Xidmətləri MMC-nin tövsiyə məktubu" },
  { name: "Sağlam Həyat C.A MMC", file: "zdrow", alt: "Sağlam Həyat C.A MMC-nin tövsiyə məktubu" },
  { name: "AZ ALİ MMC", file: "sarvagelli", alt: "AZ ALİ MMC-nin Sarvagelli Racablini MMC üçün tövsiyə məktubu" },
  { name: "Ziraat Bank Azərbaycan ASC", file: "ziraat", alt: "Ziraat Bank Azərbaycan ASC-nin tövsiyə məktubu" }
];

const dialog = document.createElement("dialog");
dialog.className = "recommendation-dialog";
dialog.setAttribute("aria-label", "Tövsiyə məktubu");
const close = document.createElement("button");
close.type = "button";
close.className = "recommendation-dialog-close";
close.setAttribute("aria-label", "Məktubu bağla");
close.textContent = "×";
const enlarged = document.createElement("img");
enlarged.alt = "";
dialog.append(close, enlarged);
document.body.append(dialog);
close.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const cards = letters.map((item) => {
  const figure = document.createElement("figure");
  figure.className = "recommendation-card";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "recommendation-card-button";
  button.setAttribute("aria-label", item.name + " tövsiyə məktubunu böyüt");

  const image = document.createElement("img");
  image.src = "assets/recommendations/" + item.file + ".jpg";
  image.alt = item.alt;
  image.loading = "lazy";
  image.decoding = "async";
  button.append(image);

  const caption = document.createElement("figcaption");
  caption.className = "recommendation-caption";
  const star = document.createElement("span");
  star.className = "recommendation-star";
  star.setAttribute("aria-hidden", "true");
  star.textContent = "✦";
  const name = document.createElement("span");
  name.textContent = item.name;
  caption.append(star, name);
  figure.append(button, caption);

  button.addEventListener("click", () => {
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    dialog.showModal();
  });
  return figure;
});

grid.replaceChildren(...cards);
grid.hidden = false;
empty.hidden = true;
