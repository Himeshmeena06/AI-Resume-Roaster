const roastTemplates = {
  "Friendly Roast": [
    "Your resume is not bad. It is just hiding its achievements like they signed an NDA.",
    "This resume has potential, but right now the best bullet point is its confidence.",
    "Recruiters can see the effort. They just need a stronger flashlight."
  ],
  "Recruiter Roast": [
    "Recruiters spend 6 seconds on a resume. Yours spends 5 of them warming up.",
    "Your skills section is doing attendance, not persuasion.",
    "This resume says you worked hard, but forgets to prove anyone benefited."
  ],
  "FAANG Recruiter Roast": [
    "Your project section says ambition, but the bullets need the engineering receipts.",
    "FAANG recruiters love scale. This resume currently scales from vague to slightly more vague.",
    "The tech stack is visible, but the impact is still in beta."
  ],
  "Brutal Roast": [
    "Your resume has more whitespace than evidence.",
    "This is not a resume yet. It is a polite list of things that happened near you.",
    "The bullets are so vague they could apply to a group project, a club meeting, or a weather report."
  ],
  "Reality Check Mode": [
    "You are closer than you think, but generic bullets are costing you interviews.",
    "The market is competitive. Your resume needs proof, numbers, and sharper role alignment.",
    "A recruiter will not infer impact. Put the impact on the page."
  ]
};

function initRoast() {
  qs("#roastText").value = resumeToText(Storage.get("resume"));
  qs("#roastBtn").addEventListener("click", generateRoast);
}

async function generateRoast() {
  const text = qs("#roastText").value.trim();
  const level = qs("#roastLevel").value;
  if (!text) return toast("Add resume text first");
  const analysis = Analyzer.analyze(text);
  const output = qs("#roastOutput");
  output.textContent = "Thinking...";
  output.classList.add("typing");

  let roast = null;
  try {
    roast = await Gemini.generate(`Roast this resume in ${level}. Be humorous but constructive. No abuse, hate, or personal attacks. After the roast, include 4 actionable fixes.\n\nResume:\n${text.slice(0, 6000)}`);
  } catch {
    roast = null;
  }

  if (!roast) {
    const pool = roastTemplates[level] || roastTemplates["Friendly Roast"];
    roast = pool[Math.floor(Math.random() * pool.length)];
  }
  output.classList.remove("typing");
  typeText(output, roast.split(/\nActionable fixes:|Fixes:/i)[0].trim());
  const fixes = [...analysis.weaknesses, ...analysis.formattingIssues, `Add missing keywords: ${analysis.missingTech.slice(0, 4).join(", ")}`].slice(0, 5);
  qs("#fixes").innerHTML = fixes.map(fix => `<li>${escapeHtml(fix)}</li>`).join("");
}

function typeText(node, text) {
  node.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    node.textContent += text[i] || "";
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, 15);
}

document.addEventListener("DOMContentLoaded", initRoast);
