const Analyzer = (() => {
  const techKeywords = ["javascript", "typescript", "react", "node.js", "node", "express", "mongodb", "sql", "python", "java", "aws", "docker", "git", "rest", "api", "tailwind", "next.js", "redux", "testing", "ci/cd"];
  const actionVerbs = ["developed", "implemented", "optimized", "designed", "built", "launched", "improved", "reduced", "automated", "led", "created", "integrated", "deployed"];
  const weakPhrases = ["made", "worked on", "helped", "responsible for", "did", "various"];

  function analyze(text, jobDescription = "") {
    const clean = (text || "").toLowerCase();
    const words = clean.match(/[a-z+#.]+/g) || [];
    const wordCount = words.length;
    const foundTech = techKeywords.filter(k => clean.includes(k));
    const missingTech = techKeywords.filter(k => !clean.includes(k)).slice(0, 7);
    const foundVerbs = actionVerbs.filter(k => clean.includes(k));
    const missingVerbs = actionVerbs.filter(k => !clean.includes(k)).slice(0, 6);
    const hasNumbers = /\d+%|\d+\+|\$\d+|\b\d{2,}\b/.test(clean);
    const sectionHits = ["education", "skills", "experience", "projects", "certifications"].filter(s => clean.includes(s)).length;
    const jdWords = [...new Set((jobDescription.toLowerCase().match(/[a-z+#.]{3,}/g) || []))].filter(w => !["and", "the", "with", "for", "you", "are", "our"].includes(w));
    const jdMatches = jdWords.filter(w => clean.includes(w));

    const formatting = clamp(50 + sectionHits * 8 + (wordCount > 250 ? 10 : 0), 0, 100);
    const skills = clamp(foundTech.length * 9 + 20, 0, 100);
    const experience = clamp((clean.includes("experience") ? 28 : 0) + foundVerbs.length * 7 + (hasNumbers ? 18 : 0) + 18, 0, 100);
    const projects = clamp((clean.includes("project") ? 48 : 18) + foundTech.length * 4 + (hasNumbers ? 10 : 0), 0, 100);
    const keyword = jdWords.length ? Math.round((jdMatches.length / jdWords.length) * 100) : clamp(foundTech.length * 7 + foundVerbs.length * 3, 0, 100);
    const readability = clamp(100 - Math.max(0, averageSentenceLength(text) - 22) * 2 - weakPhrases.filter(p => clean.includes(p)).length * 6, 35, 100);
    const overall = Math.round(formatting * .16 + skills * .18 + experience * .2 + projects * .16 + keyword * .18 + readability * .12);

    return {
      overall,
      breakdown: { formatting, skills, experience, projects, keyword, readability },
      strengths: buildStrengths(foundTech, foundVerbs, hasNumbers, sectionHits),
      weaknesses: buildWeaknesses(wordCount, foundTech, foundVerbs, hasNumbers, sectionHits, weakPhrases.filter(p => clean.includes(p))),
      missingTech,
      missingVerbs,
      formattingIssues: sectionHits < 4 ? ["Add clear section headings for Skills, Projects, Education, and Experience.", "Keep bullets concise and achievement-led."] : ["Use consistent date and role formatting.", "Keep the resume to one page for internship and fresher roles."],
      suggestions: rewriteSuggestions(text),
      industry: {
        internship: clamp(overall + 10, 0, 100),
        fresher: clamp(overall + 3, 0, 100),
        sde: clamp(overall - 6, 0, 100),
        faang: clamp(overall - 18, 0, 100)
      },
      match: jdWords.length ? Math.round((jdMatches.length / jdWords.length) * 100) : null,
      matchedKeywords: jdMatches.slice(0, 14),
      missingJobKeywords: jdWords.filter(w => !clean.includes(w)).slice(0, 14)
    };
  }

  function averageSentenceLength(text) {
    const sentences = String(text || "").split(/[.!?]+/).filter(s => s.trim());
    if (!sentences.length) return 0;
    return sentences.reduce((sum, sentence) => sum + sentence.trim().split(/\s+/).length, 0) / sentences.length;
  }

  function buildStrengths(tech, verbs, hasNumbers, sectionHits) {
    const out = [];
    if (tech.length >= 5) out.push("Strong technical keyword coverage for software roles.");
    if (verbs.length >= 4) out.push("Uses action-oriented language that recruiters can scan quickly.");
    if (hasNumbers) out.push("Includes quantified impact, which improves credibility.");
    if (sectionHits >= 4) out.push("Contains the core ATS sections expected by recruiters.");
    return out.length ? out : ["The resume has a usable foundation and can improve quickly with sharper bullets."];
  }

  function buildWeaknesses(wordCount, tech, verbs, hasNumbers, sectionHits, weak) {
    const out = [];
    if (wordCount < 180) out.push("Content is thin; add more project and achievement detail.");
    if (tech.length < 5) out.push("Technical keyword coverage is low for modern software roles.");
    if (verbs.length < 4) out.push("Bullets need stronger action verbs.");
    if (!hasNumbers) out.push("Impact is not quantified with metrics, scale, or outcomes.");
    if (sectionHits < 4) out.push("Some standard ATS sections are missing or unclear.");
    if (weak.length) out.push(`Replace vague phrasing such as ${weak.slice(0, 3).join(", ")}.`);
    return out;
  }

  function rewriteSuggestions(text) {
    const samples = [
      ["Made a website", "Developed a responsive web application using React and REST APIs, improving user task completion and reducing page load friction."],
      ["Worked on backend", "Implemented secure API endpoints with Node.js and MongoDB, adding validation, authentication, and structured error handling."],
      ["Helped in project", "Collaborated with a team of 4 to ship a production-ready feature, resolving defects and documenting deployment steps."]
    ];
    const firstLine = String(text || "").split(/\n/).find(line => line.trim().length > 10);
    if (firstLine) samples.unshift([firstLine.slice(0, 110), strengthenBullet(firstLine)]);
    return samples.slice(0, 4);
  }

  function strengthenBullet(line) {
    const clean = line.replace(/^[-*]\s*/, "").trim();
    return clean.match(/developed|implemented|optimized|built/i)
      ? `${clean} with measurable outcomes, clear ownership, and business or user impact.`
      : `Developed ${clean.toLowerCase()} using relevant technologies, improving reliability, usability, or delivery speed.`;
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Math.round(value))); }
  return { analyze, techKeywords, actionVerbs };
})();
