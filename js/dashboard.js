function initDashboard() {
  const text = resumeToText(Storage.get("resume"));
  const analysis = Storage.get("analysis") || Analyzer.analyze(text);
  const trend = Storage.get("trend") || [{ score: analysis.overall }];
  renderKpis(analysis);
  Charts.line(qs("#trendChart"), trend);
  Charts.radar(qs("#radarChart"), analysis.breakdown);
  qs("#latestTips").innerHTML = [...analysis.weaknesses, ...analysis.formattingIssues].slice(0, 8).map(tip => `<li>${escapeHtml(tip)}</li>`).join("");
}

function renderKpis(analysis) {
  const kpis = [
    ["ATS Score", `${analysis.overall}/100`],
    ["Keyword Coverage", `${analysis.breakdown.keyword}%`],
    ["Skill Strength", `${analysis.breakdown.skills}%`],
    ["Completeness", `${analysis.breakdown.formatting}%`]
  ];
  qs("#kpis").innerHTML = kpis.map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`).join("");
}

document.addEventListener("DOMContentLoaded", initDashboard);
