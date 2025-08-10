// function findChapterByQuestion(questionText) {
//   questionText = questionText.toLowerCase();

//   if (questionText.includes("chlorophyll")) return "Chapter 4";
//   if (questionText.includes("calvin cycle")) return "Chapter 5";

//   // Default fallback
//   return "Chapter 1";
// }

// module.exports = { findChapterByQuestion };/


// src/services/contentMapper.js
const Material = require("../models/Material");

async function findChapterByQuestion(questionText) {
  const material = await Material.findOne().sort({ createdAt: -1 });
  if (!material || !material.sections) return "Unknown";

  const match = material.sections.find(section =>
    section.content.toLowerCase().includes(questionText.toLowerCase())
  );

  return match ? match.chapter : "Unknown";
}

module.exports = { findChapterByQuestion };
