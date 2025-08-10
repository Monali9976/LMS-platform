// const fs = require('fs');
// const path = require('path');
// const Material = require('../models/Material');
// const { parsePDF } = require('../services/fileParser');
// const { chunkText } = require('../utils/chunking');

// async function uploadMaterial(req, res) {
//   try {
//     if (!req.file) return res.status(400).json({ ok: false, error: 'no file' });
//     const filePath = req.file.path;
//     const pages = await parsePDF(filePath);
//     const docs = [];
//     for (let i = 0; i < pages.length; i++) {
//       const pageText = pages[i];
//       const chunks = chunkText(pageText, 1500);
//       for (const ch of chunks) {
//         docs.push({ materialName: req.file.originalname, pageNumber: i + 1, text: ch });
//       }
//     }
//     await Material.insertMany(docs);
//     fs.unlinkSync(filePath);
//     res.json({ ok: true, indexed: docs.length });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ ok: false, error: err.message });
//   }
// }

// module.exports = { uploadMaterial };



const pdfParse = require("pdf-parse");
const Material = require("../models/Material");

async function uploadMaterial(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer; // Multer provides this
    const data = await pdfParse(fileBuffer);

    const sections = data.text
      .split(/Chapter\s+\d+/i)
      .map((content, index) => ({
        chapter: `Chapter ${index + 1}`,
        content
      }));

    await Material.create({
      filename: req.file.originalname,
      sections
    });

    res.json({ ok: true, indexed: sections.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadMaterial };
