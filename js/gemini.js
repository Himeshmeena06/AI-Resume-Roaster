const Gemini = (() => {
  async function generate(prompt) {
    const settings = Storage.get("settings") || {};
    if (!settings.geminiKey) return null;
    const model = settings.model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
      })
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map(part => part.text).join("\n").trim() || "";
  }
  return { generate };
})();
