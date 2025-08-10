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
