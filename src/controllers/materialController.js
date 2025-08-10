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
