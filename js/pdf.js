async function extractResumeText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdfText(file);
  if (name.endsWith(".docx")) return extractDocxText(file);
  return file.text();
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) return "PDF.js is still loading. Try again in a moment.";
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const text = await page.getTextContent();
    pages.push(text.items.map(item => item.str).join(" "));
  }
  return pages.join("\n\n");
}

async function extractDocxText(file) {
  if (!window.mammoth) return "DOCX parser is loading. Try again in a moment.";
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}
