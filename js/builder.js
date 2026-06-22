const fields = [
  ["personal", "Personal Information"],
  ["summary", "Profile Summary"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["certifications", "Certifications"],
  ["achievements", "Achievements"],
  ["languages", "Languages"]
];

let resume = Storage.get("resume");
const tabs = qs("#sectionTabs");
const editors = qs("#editors");
const preview = qs("#resumePreview");

function initBuilder() {
  qs("#template").value = resume.template || "modern";
  tabs.innerHTML = fields.map(([key, label], index) => `<button class="tab ${index === 0 ? "active" : ""}" data-tab="${key}">${label}</button>`).join("");
  editors.innerHTML = fields.map(([key, label], index) => editorMarkup(key, label, index === 0)).join("");
  bindInputs();
  renderResume(resume, preview);
}

function editorMarkup(key, label, active) {
  if (key === "personal") {
    const p = resume.personal || {};
    return `<div class="section-editor ${active ? "active" : ""}" data-editor="${key}">
      <div class="form-grid">
        ${["name", "title", "email", "phone", "location", "links"].map(field => `
          <div class="field"><label>${title(field)}</label><input class="input" data-personal="${field}" value="${escapeHtml(p[field] || "")}"></div>
        `).join("")}
      </div>
    </div>`;
  }
  return `<div class="section-editor ${active ? "active" : ""}" data-editor="${key}">
    <div class="field"><label>${label}</label><textarea class="textarea" data-field="${key}">${escapeHtml(resume[key] || "")}</textarea></div>
  </div>`;
}

function bindInputs() {
  qsa(".tab", tabs).forEach(tab => tab.addEventListener("click", () => {
    qsa(".tab", tabs).forEach(item => item.classList.remove("active"));
    qsa(".section-editor", editors).forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    qs(`[data-editor="${tab.dataset.tab}"]`, editors).classList.add("active");
  }));

  qs("#template").addEventListener("change", event => updateResume("template", event.target.value));
  qsa("[data-field]").forEach(input => input.addEventListener("input", event => updateResume(event.target.dataset.field, event.target.value)));
  qsa("[data-personal]").forEach(input => input.addEventListener("input", event => {
    resume.personal = resume.personal || {};
    resume.personal[event.target.dataset.personal] = event.target.value;
    persist();
  }));

  qs("#downloadTxt").addEventListener("click", () => downloadText("RoastMyResume-resume.txt", resumeToText(resume)));
  qs("#downloadPdf").addEventListener("click", () => {
    if (!window.html2pdf) return toast("PDF exporter is loading. Try again in a moment.");
    html2pdf().set({ margin: 0.35, filename: "RoastMyResume-resume.pdf", html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "a4" } }).from(preview).save();
  });
}

function updateResume(key, value) {
  resume[key] = value;
  persist();
}

function persist() {
  Storage.set("resume", resume);
  renderResume(resume, preview);
}

function title(value) {
  return value.replace(/^\w/, char => char.toUpperCase());
}

document.addEventListener("DOMContentLoaded", initBuilder);
