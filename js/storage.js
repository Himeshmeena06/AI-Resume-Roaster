const Storage = (() => {
  const keys = {
    resume: "rmr_resume_v1",
    analysis: "rmr_analysis_v1",
    settings: "rmr_settings_v1",
    trend: "rmr_trend_v1"
  };

  const defaults = {
    resume: {
      template: "modern",
      personal: { name: "Aarav Sharma", title: "Software Engineering Intern", email: "aarav@email.com", phone: "+91 98765 43210", location: "Bengaluru, India", links: "github.com/aarav | linkedin.com/in/aarav" },
      summary: "Computer science student focused on building reliable web applications, AI tools, and data-driven products.",
      education: "B.Tech Computer Science, 2026\nRelevant coursework: DSA, DBMS, Operating Systems, Machine Learning",
      skills: "JavaScript, React, Node.js, Express, MongoDB, SQL, Python, Git, REST APIs",
      experience: "Software Intern - Built internal dashboards and automated reporting workflows for product metrics.",
      projects: "RoastMyResume AI - Built an ATS resume analyzer with scoring, keyword feedback, and PDF export.\nCampus Connect - Developed a student event platform with authentication and role-based dashboards.",
      certifications: "Google Cloud Computing Foundations\nMeta Front-End Developer Certificate",
      achievements: "Finalist, Smart India Hackathon\nSolved 400+ DSA problems",
      languages: "English, Hindi"
    },
    settings: { geminiKey: "", model: "gemini-1.5-flash", tone: "constructive" }
  };

  function get(key) {
    try { return JSON.parse(localStorage.getItem(keys[key])) ?? defaults[key] ?? null; }
    catch { return defaults[key] ?? null; }
  }

  function set(key, value) {
    localStorage.setItem(keys[key], JSON.stringify(value));
    return value;
  }

  function pushTrend(score) {
    const trend = get("trend") || [];
    trend.push({ score, date: new Date().toISOString() });
    set("trend", trend.slice(-12));
  }

  return { get, set, pushTrend, defaults };
})();
