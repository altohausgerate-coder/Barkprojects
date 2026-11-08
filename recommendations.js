const recommendationGrid = document.querySelector("#recommendation-pages");
const recommendationEmpty = document.querySelector("#recommendations-empty");

const letters = [
  {
    issuer: "Real-İnşaat MMC",
    date: "17.09.2025",
    recipient: "AZ ALİ MMC",
    project: "Gəncə Memorial Kompleksi",
    summary: "Gəncə Memorial Kompleksi üçün ofis mebeli, rəhbər və işçi kresloları, eləcə də yumşaq mebellər təchiz edilib. Məktubda məhsulların keyfiyyəti, rahatlığı, funksionallığı, davamlılığı və erqonomikası, sifarişlərin vaxtında çatdırılması və çevik xidmət yüksək qiymətləndirilir."
  },
  {
    issuer: "KDY Logistics AZ MMC",
    date: "17.09.2025",
    recipient: "AZ ALİ MMC",
    project: "Riverside Hotel Ağdərə",
    summary: "Ağdərə rayonundakı Riverside Hotel layihəsində ofis mebeli, rəhbər və işçi kresloları, eləcə də yumşaq mebellər təchiz edilib. Məktub keyfiyyət, rahatlıq, funksionallıq, vaxtında çatdırılma və operativ xidmətə görə məmnunluğu bildirir."
  },
  {
    issuer: "NIMEX MMC",
    date: "12.07.2021",
    recipient: "AZ ALİ MMC",
    project: "Əmlak Komitəsi və İqtisadiyyat Nazirliyinin yeni binaları",
    summary: "NIMEX MMC bu iki iri layihədə üzərinə götürülən öhdəliklərin yüksək səviyyədə yerinə yetirildiyini təsdiqləyir və əməkdaşlıqdan razılığını bildirir."
  },
  {
    issuer: "Azərbaycan Beynəlxalq Bankı ASC",
    date: "12.01.2026",
    recipient: "AZ ALİ MMC",
    project: "MXS və inzibati binalarda divar üzlənməsi",
    summary: "ABB-2024/258 müqaviləsi üzrə divar üzlənmə işləri həyata keçirilib. Bank xidmət səviyyəsindən razı qaldığını bildirir, peşəkarlığı, keyfiyyəti və operativliyi qeyd edir və bu sahədə əməkdaşlığı tövsiyə edir."
  },
  {
    issuer: "BMS PRO MMC",
    date: "",
    recipient: "AZ ALİ MMC",
    project: "BMS PRO ofis mebelləri",
    summary: "Ofis mebelləri qısa müddətdə təchiz edilib. Məktubda peşəkarlıq, keyfiyyət və məsuliyyət qeyd olunur; şirkət əməkdaşlıqdan məmnunluğunu və gələcək layihələrdə də davam etmək niyyətini bildirir."
  },
  {
    issuer: "Olimp Mühəndis Xidmətləri MMC",
    date: "09.09.2021 · №123/21",
    recipient: "AZ ALİ MMC",
    project: "Macara Hotel, Quba",
    summary: "Otelin mebel və digər bərk inventarlarla təchizatı müqaviləyə uyğun, keyfiyyətlə və vaxtında icra edilib. Məktubda komandanın peşəkarlığı, operativliyi və işlərə yaradıcı yanaşması vurğulanır."
  },
  {
    issuer: "Macara Club MMC",
    date: "01.12.2024",
    recipient: "AZ ALİ MMC",
    project: "Otel, restoran və ofis mebelləri",
    summary: "Məktub mebelin etibarlılığını, estetikasını və davamlılığını, seçim zamanı üslub və büdcə dəstəyini, fərdi həlləri, sürətli çatdırılma və montajı, eləcə də iri sifarişlərə çevik yanaşmanı yüksək qiymətləndirir."
  },
  {
    issuer: "ABICON MMC",
    date: "17.09.2025",
    recipient: "AZ ALİ MMC",
    project: "SHAFA kafe, Heydər Əliyev Beynəlxalq Hava Limanı",
    summary: "Kafe layihəsində ofis mebeli, kreslolar və yumşaq mebellər təchiz olunub. Məktub məhsulların keyfiyyətini, rahatlığını və funksionallığını, vaxtında çatdırılmanı və çevik xidməti müsbət qiymətləndirir."
  },
  {
    issuer: "Mühəndislik Tikinti Təchizat MMC",
    date: "",
    recipient: "AZ ALİ MMC",
    project: "Təhsil Nazirliyi üçün sifarişlər",
    summary: "Məktub sifarişlər üzrə əməkdaşlıqdan məmnunluğu, tələblərin yerinə yetirilməsində peşəkarlığı və komanda işini qeyd edir, AZ ALİ MMC-ni digər təşkilatlara tövsiyə edir."
  },
  {
    issuer: "EPISOM MMC",
    date: "15.08.2024",
    recipient: "AZ ALİ MMC",
    project: "Mebel və digər bərk inventarların təchizatı",
    summary: "Əməkdaşlıq çərçivəsində işlərin keyfiyyətlə və vaxtında icra olunduğu bildirilir. Məktub etibarlılığı, peşəkar komanda işini və sifarişlərin vaxtında yerinə yetirilməsini vurğulayır."
  },
  {
    issuer: "Sağlam Həyat C.A MMC",
    date: "07.11.2024",
    recipient: "AZ ALİ MMC",
    project: "Mebel və digər bərk inventarların təchizatı",
    summary: "Məktubda sifarişlərin vaxtında və keyfiyyətlə icrası, peşəkar və operativ xidmət, eləcə də etibarlı əməkdaşlıq müsbət qiymətləndirilir."
  },
  {
    issuer: "AZ ALİ MMC",
    date: "07.08.2026",
    recipient: "Sarvagelli Racablini MMC",
    project: "Jalüz və pərdələrin təchizatı və quraşdırılması",
    summary: "Əməkdaşlıq çərçivəsində jalüz və pərdələrin vaxtında, keyfiyyət standartlarına uyğun təchizatı və quraşdırılması qeyd olunur. Məktub Sarvagelli Racablini MMC-ni bu sahədə etibarlı və peşəkar tərəfdaş kimi tövsiyə edir."
  },
  {
    issuer: "Kucha MMC",
    date: "20.09.2023",
    recipient: "AZ ALİ MMC",
    project: "Mebel sektorunda əməkdaşlıq",
    summary: "Məktub işlərin və öhdəliklərin vaxtında, yüksək keyfiyyətlə yerinə yetirilməsindən məmnunluğu bildirir və şirkəti mebel sahəsində əməkdaşlıq üçün tövsiyə edir."
  },
  {
    issuer: "Ziraat Bank Azərbaycan ASC",
    date: "28.02.2025",
    recipient: "AZ ALİ MMC",
    project: "Ofis və yumşaq mebellərin təchizatı",
    summary: "Bank ofis mebeli, rəhbər və işçi kresloları, eləcə də yumşaq mebellərin keyfiyyətini, rahatlığını və funksionallığını müsbət qiymətləndirir. Məktubda vaxtında çatdırılma və müştəri məmnuniyyətinə diqqət qeyd olunur."
  }
];

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapWords(value, maxChars) {
  const words = String(value || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? line + " " + word : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function svgLines(value, x, y, step, size, fill, weight, maxChars) {
  return wrapWords(value, maxChars).map((line, index) =>
    '<text x="' + x + '" y="' + (y + index * step) + '" font-size="' + size +
    '" font-weight="' + weight + '" fill="' + fill +
    '" font-family="Arial, Helvetica, sans-serif">' + escapeXml(line) + "</text>"
  ).join("");
}

function makeSheet(item) {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123" viewBox="0 0 794 1123">',
    '<rect width="794" height="1123" fill="#f7f5f0"/>',
    '<rect x="22" y="22" width="750" height="1079" fill="none" stroke="#d6d0c6" stroke-width="1"/>',
    '<text x="68" y="76" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="2.2" fill="#242421">BARK PROJECTS</text>',
    '<text x="724" y="76" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="1.2" fill="#8b7864">TƏRƏFDAŞ RƏYİ</text>',
    '<line x1="68" y1="108" x2="726" y2="108" stroke="#a99884" stroke-width="1"/>',
    '<text x="68" y="167" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2.5" fill="#8b7864">TÖVSİYƏ MƏKTUBU · MƏZMUN XÜLASƏSİ</text>',
    svgLines(item.issuer, 68, 232, 37, 30, "#242421", 600, 39),
    '<text x="68" y="307" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="1.8" fill="#8b7864">TÖVSİYƏ EDİLƏN TƏRƏF</text>',
    svgLines(item.recipient, 68, 348, 32, 22, "#373630", 500, 44),
    '<text x="68" y="416" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="1.8" fill="#8b7864">LAYİHƏ / ƏMƏKDAŞLIQ</text>',
    svgLines(item.project, 68, 457, 34, 24, "#242421", 500, 44),
    item.date ? '<text x="726" y="167" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#6e6a63">' + escapeXml(item.date) + "</text>" : "",
    '<line x1="68" y1="532" x2="726" y2="532" stroke="#d6d0c6" stroke-width="1"/>',
    '<text x="68" y="586" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="1.6" fill="#8b7864">ƏSAS MƏQAMLAR</text>',
    svgLines(item.summary, 68, 635, 34, 21, "#373630", 400, 62),
    '<line x1="68" y1="1038" x2="726" y2="1038" stroke="#d6d0c6" stroke-width="1"/>',
    '<text x="68" y="1072" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="1.2" fill="#77736c">ƏVVƏLKİ AZ ALİ MMC LAYİHƏLƏRİ ÜZRƏ TƏRƏFDAŞ RƏYİ</text>',
    "</svg>"
  ].join("");
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function openLetter(item, src, dialog, dialogImage) {
  dialogImage.src = src;
  dialogImage.alt = "A4 formatlı tövsiyə məktubu xülasəsi: " + item.issuer + " — " + item.project;
  dialog.showModal();
}

const dialog = document.createElement("dialog");
dialog.className = "recommendation-dialog";
dialog.setAttribute("aria-label", "Tövsiyə məktubunun A4 xülasəsi");
const dialogClose = document.createElement("button");
dialogClose.type = "button";
dialogClose.className = "recommendation-dialog-close";
dialogClose.textContent = "Bağla";
const dialogImage = document.createElement("img");
dialogImage.alt = "";
dialog.append(dialogClose, dialogImage);
dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.body.append(dialog);

const cards = letters.map((item) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "recommendation-image-card";
  button.setAttribute("aria-label", item.issuer + " tərəfindən " + item.project + " üzrə tövsiyə xülasəsini böyüt");
  const image = document.createElement("img");
  image.src = makeSheet(item);
  image.alt = "A4 formatlı tövsiyə məktubu xülasəsi: " + item.issuer + " — " + item.project;
  image.loading = "lazy";
  const caption = document.createElement("span");
  caption.className = "recommendation-image-caption";
  caption.textContent = item.issuer + (item.date ? " · " + item.date : "");
  button.append(image, caption);
  button.addEventListener("click", () => openLetter(item, image.src, dialog, dialogImage));
  return button;
});

recommendationGrid.replaceChildren(...cards);
recommendationEmpty.hidden = true;
recommendationGrid.hidden = false;
