const pdfParse = require('pdf-parse');
const fs = require('fs');

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  // simple split into pages using form-feed if available, else split by double newlines
  const pages = data.text.split('\f').map(p => p.trim()).filter(Boolean);
  if (!pages.length) {
    // fallback: split by paragraphs
    return data.text.split('\n\n').map(p => p.trim()).filter(Boolean);
  }
  return pages;
}

module.exports = { parsePDF };