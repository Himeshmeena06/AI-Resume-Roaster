function initSettings() {
  const settings = Storage.get("settings") || {};
  qs("#geminiKey").value = settings.geminiKey || "";
  qs("#model").value = settings.model || "gemini-1.5-flash";
  qs("#tone").value = settings.tone || "constructive";
  qs("#saveSettings").addEventListener("click", () => {
    Storage.set("settings", {
      geminiKey: qs("#geminiKey").value.trim(),
      model: qs("#model").value,
      tone: qs("#tone").value
    });
    toast("Settings saved");
  });
}
document.addEventListener("DOMContentLoaded", initSettings);
