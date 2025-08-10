// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const { uploadMaterial } = require('../controllers/materialController');

// router.post('/upload-material', upload.single('file'), uploadMaterial);
// module.exports = router;



// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const router = express.Router();

// // Configure Multer
// const upload = multer({ dest: "uploads/" });

// router.post("/upload-material", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Read file from uploads folder
//     const fileBuffer = fs.readFileSync(req.file.path);

//     // Parse PDF
//     const pdfData = await pdfParse(fileBuffer);

//     // For now, just return the text length
//     res.json({
//       ok: true,
//       fileName: req.file.originalname,
//       textLength: pdfData.text.length,
//     });

//   } catch (err) {
//     console.error("Error processing file:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// let pdfTextContent = "";

// router.post("/upload-material", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const fileBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(fileBuffer);

//     pdfTextContent = pdfData.text;

//     res.json({
//       ok: true,
//       indexed: pdfTextContent.length
//     });

//   } catch (err) {
//     console.error("Error processing file:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// function pdfTextContentRef() {
//   return pdfTextContent;
// }

// module.exports = { router, pdfTextContentRef };



// // src/routes/materialRoutes.js
// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // Stores extracted text
// let pdfTextContent = "";
// let chapterIndex = []; // array of { chapterTitle, content }

// router.post("/upload-material", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const fileBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(fileBuffer);

//     pdfTextContent = pdfData.text;

//     // Build chapter index
//     chapterIndex = buildChapterIndex(pdfTextContent);

//     res.json({
//       ok: true,
//       chaptersIndexed: chapterIndex.length
//     });

//   } catch (err) {
//     console.error("Error processing file:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Simple function to split PDF text into chapters
// function buildChapterIndex(fullText) {
//   const lines = fullText.split("\n").map(l => l.trim()).filter(l => l);

//   let chapters = [];
//   let currentChapter = null;

//   lines.forEach(line => {
//     const chapterMatch = line.match(/^(Chapter\s+\d+[:\-]?\s*.*)$/i);
//     if (chapterMatch) {
//       if (currentChapter) {
//         chapters.push(currentChapter);
//       }
//       currentChapter = { chapterTitle: chapterMatch[1], content: "" };
//     } else if (currentChapter) {
//       currentChapter.content += " " + line;
//     }
//   });

//   if (currentChapter) {
//     chapters.push(currentChapter);
//   }

//   return chapters;
// }

// function getChapterIndex() {
//   return chapterIndex;
// }

// module.exports = { router, getChapterIndex };



// // routes/materialRoutes.js
// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const { uploadMaterial } = require("../controllers/materialController");

// router.post("/upload-material", upload.single("file"), uploadMaterial);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// router.post("/upload-material", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const fs = require("fs");
//     const pdfData = new Uint8Array(fs.readFileSync(req.file.path));

//     const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//     const numPages = pdf.numPages;

//     res.json({ ok: true, pages: numPages });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// const router = express.Router();

// // Set up multer storage
// const upload = multer({
//     dest: path.join(__dirname, "../../uploads")
// });

// // Upload and parse PDF
// router.post("/upload-material", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         // Read PDF file as Uint8Array
//         const fileData = new Uint8Array(fs.readFileSync(req.file.path));

//         // Load PDF
//         const pdfDoc = await pdfjsLib.getDocument({ data: fileData }).promise;

//         res.json({
//             ok: true,
//             pages: pdfDoc.numPages
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;




// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// const router = express.Router();

// // Store chapters in memory
// let chapters = [];

// // Multer setup
// const upload = multer({
//     dest: path.join(__dirname, "../../uploads")
// });

// // Function to extract chapters from PDF
// async function extractChaptersFromPDF(filePath) {
//     const fileData = new Uint8Array(fs.readFileSync(filePath));
//     // const pdfDoc = await pdfjsLib.getDocument({ data: fileData }).promise;
// const pdfDoc = await pdfjsLib.getDocument({
//     data: fileData,
//     standardFontDataUrl: path.join(__dirname, "../../node_modules/pdfjs-dist/standard_fonts/")
// }).promise;

//     let content = '';
//     for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//         const page = await pdfDoc.getPage(pageNum);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items.map(i => i.str).join(' ');
//         content += pageText + '\n';
//     }
// chapters = splitIntoChapters(content);
//     // Very simple chapter splitting logic
//     // chapters = content.split(/Chapter\s+\d+/i).map((text, i) => ({
//     //     chapterTitle: `Chapter ${i}`,
//     //     content: text
//     // }));
// function splitIntoChapters(content) {
//     const regex = /(Chapter\s+\d+.*?)(?=Chapter\s+\d+|$)/gis;
//     let matches;
//     const chapterList = [];

//     while ((matches = regex.exec(content)) !== null) {
//         const chapterTitleMatch = matches[1].match(/Chapter\s+\d+/i);
//         const chapterTitle = chapterTitleMatch ? chapterTitleMatch[0] : `Chapter ${chapterList.length + 1}`;
//         chapterList.push({
//             chapterTitle,
//             content: matches[1]
//         });
//     }

//     return chapterList;
// }

// }

// // Upload and parse PDF
// router.post("/upload-material", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//         await extractChaptersFromPDF(req.file.path);

//         res.json({
//             ok: true,
//             chapters: chapters.length
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Export both router and getter
// function getChapterIndex() {
//     return chapters;
// }

// module.exports = { router, getChapterIndex };





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
