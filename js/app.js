function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return [...root.querySelectorAll(selector)]; }

function toast(message) {
  let node = qs(".toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast";
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2400);
}

function resumeToText(resume = Storage.get("resume")) {
  const p = resume.personal || {};
  return [
    p.name, p.title, p.email, p.phone, p.location, p.links,
    resume.summary, resume.education, resume.skills, resume.experience,
    resume.projects, resume.certifications, resume.achievements, resume.languages
  ].filter(Boolean).join("\n\n");
}

function renderResume(resume, target) {
  if (!target) return;
  const p = resume.personal || {};
  const sections = [
    ["Profile", resume.summary],
    ["Education", resume.education],
    ["Skills", resume.skills],
    ["Experience", resume.experience],
    ["Projects", resume.projects],
    ["Certifications", resume.certifications],
    ["Achievements", resume.achievements],
    ["Languages", resume.languages]
  ];
  target.className = `resume-paper template-${resume.template || "modern"}`;
  target.innerHTML = `
    <h2>${escapeHtml(p.name || "Your Name")}</h2>
    <p><strong>${escapeHtml(p.title || "Target Role")}</strong></p>
    <p>${escapeHtml([p.email, p.phone, p.location, p.links].filter(Boolean).join(" | "))}</p>
    ${sections.filter(([, body]) => body).map(([title, body]) => `
      <h3>${title}</h3>
      ${formatResumeBody(body)}
    `).join("")}
  `;
}

function formatResumeBody(text) {
  const lines = String(text).split(/\n+/).map(line => line.trim()).filter(Boolean);
  if (lines.length > 1) return `<ul>${lines.map(line => `<li>${escapeHtml(line.replace(/^[-*]\s*/, ""))}</li>`).join("")}</ul>`;
  return `<p>${escapeHtml(text)}</p>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function setActiveNav() {
  const file = location.pathname.split("/").pop() || "index.html";
  qsa(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === file) link.classList.add("active");
  });
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", setActiveNav);
