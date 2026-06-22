const Charts = (() => {
  function doughnut(canvas, value, label = "ATS Score") {
    if (!canvas || !window.Chart) return;
    return new Chart(canvas, {
      type: "doughnut",
      data: { labels: [label, "Gap"], datasets: [{ data: [value, 100 - value], backgroundColor: ["#34d399", "rgba(255,255,255,.09)"], borderWidth: 0 }] },
      options: { cutout: "72%", plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
  }

  function radar(canvas, breakdown) {
    if (!canvas || !window.Chart) return;
    return new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["Formatting", "Skills", "Experience", "Projects", "Keywords", "Readability"],
        datasets: [{ label: "Resume", data: Object.values(breakdown), borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.18)", pointBackgroundColor: "#8b5cf6" }]
      },
      options: { scales: { r: { suggestedMin: 0, suggestedMax: 100, grid: { color: "rgba(255,255,255,.12)" }, pointLabels: { color: "#d9def8" }, ticks: { color: "#aab2d5", backdropColor: "transparent" } } }, plugins: { legend: { labels: { color: "#f7f8ff" } } } }
    });
  }

  function line(canvas, trend) {
    if (!canvas || !window.Chart) return;
    return new Chart(canvas, {
      type: "line",
      data: { labels: trend.map((_, i) => `Run ${i + 1}`), datasets: [{ label: "ATS Score", data: trend.map(t => t.score), borderColor: "#f472b6", backgroundColor: "rgba(244,114,182,.16)", tension: .35, fill: true }] },
      options: { scales: { x: { ticks: { color: "#aab2d5" }, grid: { color: "rgba(255,255,255,.08)" } }, y: { min: 0, max: 100, ticks: { color: "#aab2d5" }, grid: { color: "rgba(255,255,255,.08)" } } }, plugins: { legend: { labels: { color: "#f7f8ff" } } } }
    });
  }
  return { doughnut, radar, line };
})();
