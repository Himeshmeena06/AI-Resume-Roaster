let scoreChart;

function initAnalyzerPage() {
  qs("#resumeText").value = resumeToText(Storage.get("resume"));
  qs("#fileInput").addEventListener("change", handleFile);
  qs(".upload-zone").addEventListener("click", () => qs("#fileInput").click());
  qs("#useBuilder").addEventListener("click", () => {
    qs("#resumeText").value = resumeToText(Storage.get("resume"));
    toast("Loaded builder resume");
  });
  qs("#analyzeBtn").addEventListener("click", runAnalysis);
  runAnalysis();
}

async function handleFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  qs("#resumeText").value = "Parsing resume...";
  try {
    qs("#resumeText").value = await extractResumeText(file);
    toast("Resume parsed");
  } catch (error) {
    qs("#resumeText").value = "";
    toast("Could not parse file. Try TXT or copy-paste content.");
  }
}

function runAnalysis() {
  const text = qs("#resumeText").value.trim();
  if (!text) return toast("Add resume text first");
  const result = Analyzer.analyze(text, qs("#jobText").value);
  Storage.set("analysis", result);
  Storage.pushTrend(result.overall);
  renderAnalysis(result);
}

function renderAnalysis(result) {
  qs("#scoreText").textContent = `${result.overall}/100`;
  if (scoreChart) scoreChart.destroy();
  scoreChart = Charts.doughnut(qs("#scoreChart"), result.overall);
  qs("#breakdown").innerHTML = Object.entries(result.breakdown).map(([key, value]) => `
    <div>
      <div class="section-head" style="margin-bottom:7px"><span>${label(key)}</span><strong>${value}</strong></div>
      <div class="progress" style="--w:${value}%"><span></span></div>
    </div>
  `).join("");
  qs("#insights").innerHTML = [
    insightCard("Strengths", result.strengths),
    insightCard("Weaknesses", result.weaknesses),
    insightCard("Missing Keywords", [...result.missingTech, ...result.missingVerbs]),
  ].join("");
  qs("#rewrites").innerHTML = result.suggestions.map(([before, after]) => `<div class="grid-2"><div class="card"><strong>Before</strong><p class="muted">${escapeHtml(before)}</p></div><div class="card"><strong>After</strong><p class="muted">${escapeHtml(after)}</p></div></div>`).join("");
  const industry = [["Internship Resume", result.industry.internship], ["Fresher Resume", result.industry.fresher], ["SDE Resume", result.industry.sde], ["FAANG Candidate", result.industry.faang]];
  qs("#comparison").innerHTML = industry.map(([name, value]) => `<div class="bar-row"><span>${name}</span><div class="progress" style="--w:${value}%"><span></span></div><strong>${value}%</strong></div>`).join("");
  if (result.match !== null) {
    qs("#insights").insertAdjacentHTML("beforeend", insightCard(`JD Match: ${result.match}%`, [`Matched: ${result.matchedKeywords.join(", ") || "None yet"}`, `Missing: ${result.missingJobKeywords.join(", ") || "Looks covered"}`]));
  }
}

function insightCard(title, items) {
  return `<article class="card"><h3>${title}</h3><ul class="list">${items.slice(0, 7).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`;
}

function label(key) {
  return key.replace(/^\w/, char => char.toUpperCase());
}

document.addEventListener("DOMContentLoaded", initAnalyzerPage);
