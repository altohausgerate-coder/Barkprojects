const recommendationGrid = document.querySelector("#recommendation-pages");
const recommendationEmpty = document.querySelector("#recommendations-empty");

function addText(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text || "";
  return element;
}

fetch("projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Recommendation records could not be loaded");
    return response.json();
  })
  .then((projects) => {
    const items = projects.filter((project) => project.recommendation?.summary);
    const sheets = items.map((project) => {
      const recommendation = project.recommendation;
      const sheet = document.createElement("article");
      sheet.className = "recommendation-sheet";
      sheet.setAttribute("aria-label", `${recommendation.source} tövsiyə məktubu`);

      const header = document.createElement("header");
      header.className = "recommendation-letter-head";
      const brand = document.createElement("div");
      brand.className = "recommendation-letter-brand";
      const logo = document.createElement("img");
      logo.src = "assets/brand/bark-projects-logo.png";
      logo.alt = "";
      const brandName = document.createElement("span");
      brandName.append(document.createTextNode("BARK"));
      const brandSub = addText("small", "", "PROJECTS");
      brandName.append(brandSub);
      brand.append(logo, brandName);
      header.append(brand, addText("span", "recommendation-letter-mark", "Tərəfdaş rəyi"));

      const content = document.createElement("div");
      content.className = "recommendation-sheet-content";
      content.append(
        addText("p", "eyebrow", "Tövsiyə məktubu"),
        addText("h2", "", recommendation.source),
        addText("p", "recommendation-project", `Layihə: ${project.title}`),
        addText("p", "recommendation-letter-body", recommendation.summary)
      );

      const signoff = document.createElement("footer");
      signoff.className = "recommendation-signoff";
      signoff.append(
        Object.assign(document.createElement("div"), { className: "recommendation-signoff-rule" }),
        addText("p", "", "Tövsiyə məlumatı"),
        addText("strong", "", recommendation.source)
      );
      sheet.append(header, content, signoff);
      return sheet;
    });
    recommendationGrid.replaceChildren(...sheets);
    recommendationEmpty.hidden = items.length !== 0;
    recommendationGrid.hidden = items.length === 0;
  })
  .catch(() => {
    recommendationEmpty.hidden = false;
    recommendationEmpty.textContent = "Tövsiyələri yükləmək mümkün olmadı. Səhifəni yeniləyin.";
    recommendationGrid.hidden = true;
  });
