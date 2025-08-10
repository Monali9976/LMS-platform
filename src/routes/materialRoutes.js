const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const router = express.Router();

// Store chapters in memory
let chapters = [];

// Multer setup
const upload = multer({
    dest: path.join(__dirname, "../../uploads")
});

// Helper: split text into chapters
function splitIntoChapters(content) {
    // Matches: Chapter 1: Node.js Basics
    const regex = /(Chapter\s+\d+[^]*?)(?=Chapter\s+\d+|$)/gi;
    let matches;
    const chapterList = [];

    while ((matches = regex.exec(content)) !== null) {
        // Extract chapter title from the first line of the match
        const lines = matches[1].trim().split("\n").filter(l => l.trim() !== "");
        const chapterTitle = lines[0].trim(); // e.g., "Chapter 2: MongoDB Concepts"
        const chapterContent = matches[1].trim();

        chapterList.push({
            chapterTitle,
            content: chapterContent
        });
    }

    return chapterList;
}


// Extract chapters from PDF
async function extractChaptersFromPDF(filePath) {
    const fileData = new Uint8Array(fs.readFileSync(filePath));
    const pdfDoc = await pdfjsLib.getDocument({
        data: fileData,
        standardFontDataUrl: path.join(__dirname, "../../node_modules/pdfjs-dist/standard_fonts/")
    }).promise;

    let content = "";
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(i => i.str).join(" ");
        content += pageText + "\n";
    }

    chapters = splitIntoChapters(content);
}

// Upload and parse PDF
router.post("/upload-material", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        await extractChaptersFromPDF(req.file.path);

        res.json({
            ok: true,
            chapters: chapters.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Getter for chapters
function getChapterIndex() {
    return chapters;
}

module.exports = { router, getChapterIndex };
