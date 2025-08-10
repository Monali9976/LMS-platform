// const express = require("express");
// const router = express.Router();
// const { submitQuiz } = require("../controllers/quizController");

// router.post("/submit-quiz", submitQuiz);

// module.exports = router;


// // src/routes/quizRoutes.js
// const express = require("express");
// const router = express.Router();

// router.post("/submit-quiz", (req, res) => {
//   const { answers } = req.body;
//   const score = answers.filter(a => a.correctAnswer === a.studentAnswer).length;
//   res.json({
//     score,
//     total: answers.length,
//     weakAreas: ["Chapter 4"],
//     recommendation: "You may need to revise Chapter 4."
//   });
// });

// module.exports = router;



// const express = require("express");
// const { pdfTextContentRef } = require("./materialRoutes"); // get PDF text
// const router = express.Router();

// // Submit quiz answers
// router.post("/submit-quiz", (req, res) => {
//   const { answers } = req.body;

//   if (!answers || !Array.isArray(answers)) {
//     return res.status(400).json({ error: "Invalid answers format" });
//   }

//   const pdfText = pdfTextContentRef();
//   if (!pdfText) {
//     return res.status(400).json({ error: "No material uploaded yet" });
//   }

//   let score = 0;
//   let weakSections = [];

//   answers.forEach(ans => {
//     if (ans.correctAnswer === ans.studentAnswer) {
//       score++;
//     } else {
//       // Try to find which chapter this question belongs to
//       const lowerText = pdfText.toLowerCase();
//       const question = ans.question.toLowerCase();

//       if (lowerText.includes("chlorophyll") && question.includes("chlorophyll")) {
//         weakSections.push("Chapter 4");
//       } else if (lowerText.includes("calvin cycle") && question.includes("calvin cycle")) {
//         weakSections.push("Chapter 5");
//       } else {
//         weakSections.push("General Concepts");
//       }
//     }
//   });

//   res.json({
//     score,
//     total: answers.length,
//     weakAreas: [...new Set(weakSections)],
//     recommendation: `You may need to revise: ${[...new Set(weakSections)].join(", ")}`
//   });
// });

// module.exports = router;




// const express = require("express");
// const { pdfTextContentRef } = require("./materialRoutes");

// const router = express.Router();

// router.post("/submit-quiz", (req, res) => {
//   const { answers } = req.body;

//   if (!Array.isArray(answers)) {
//     return res.status(400).json({ error: "Answers must be an array" });
//   }

//   // Get full PDF text content uploaded earlier
//   const pdfText = pdfTextContentRef();
//   if (!pdfText) {
//     return res.status(400).json({ error: "No PDF material uploaded yet" });
//   }

//   let score = 0;
//   let weakSections = [];

//   answers.forEach(ans => {
//     const isCorrect = ans.correctAnswer?.trim().toLowerCase() === ans.studentAnswer?.trim().toLowerCase();
//     if (isCorrect) {
//       score++;
//     } else {
//       // Try to detect relevant section from PDF text
//       const chapter = findChapterByQuestion(ans.question, pdfText);
//       if (chapter) {
//         weakSections.push(chapter);
//       }
//     }
//   });

//   // Remove duplicates
//   weakSections = [...new Set(weakSections)];

//   res.json({
//     score,
//     total: answers.length,
//     weakAreas: weakSections,
//     recommendation: weakSections.length
//       ? `You may need to revise: ${weakSections.join(", ")}.`
//       : "Great job! You covered all topics well."
//   });
// });

// function findChapterByQuestion(questionText, pdfText) {
//   const text = questionText.toLowerCase();
//   const pdfLower = pdfText.toLowerCase();

//   // Dynamically search keywords from question in PDF
//   if (pdfLower.includes(text)) {
//     // For now, just say "Matched content from PDF" (can be improved later)
//     return "Matched content from PDF";
//   }

//   return "Unmapped topic (needs review)";
// }

// module.exports = router;



// // src/routes/quizRoutes.js
// const express = require("express");
// const { getChapterIndex } = require("./materialRoutes");

// const router = express.Router();

// router.post("/submit-quiz", (req, res) => {
//   const { answers } = req.body;
//   const chapters = getChapterIndex();

//   if (!chapters || chapters.length === 0) {
//     return res.status(400).json({ error: "No study material uploaded yet" });
//   }

//   let score = 0;
//   let weakSections = [];

//   answers.forEach(a => {
//     if (a.correctAnswer === a.studentAnswer) {
//       score++;
//     } else {
//       const chapter = findChapterByQuestion(a.question, chapters);
//       weakSections.push(chapter || "Unmapped topic (needs review)");
//     }
//   });

//   const uniqueWeakSections = [...new Set(weakSections)];

//   res.json({
//     score,
//     total: answers.length,
//     weakAreas: uniqueWeakSections,
//     recommendation: `You may need to revise: ${uniqueWeakSections.join(", ")}`
//   });
// });

// function findChapterByQuestion(questionText, chapters) {
//   questionText = questionText.toLowerCase();
//   let bestMatch = null;

//   chapters.forEach(ch => {
//     const chapterTextLower = ch.content.toLowerCase();
//     // simple keyword check
//     const keywords = questionText.split(/\s+/).filter(w => w.length > 3);
//     const matchCount = keywords.filter(k => chapterTextLower.includes(k)).length;

//     if (matchCount > 0) {
//       if (!bestMatch || matchCount > bestMatch.count) {
//         bestMatch = { chapter: ch.chapterTitle, count: matchCount };
//       }
//     }
//   });

//   return bestMatch ? bestMatch.chapter : null;
// }

// module.exports = router;




const express = require("express");
const { getChapterIndex } = require("./materialRoutes");

const router = express.Router();

router.post("/submit-quiz", (req, res) => {
    const { answers } = req.body;
    const chapters = getChapterIndex();

    if (!chapters || chapters.length === 0) {
        return res.status(400).json({ error: "No study material uploaded yet" });
    }

    let score = 0;
    let weakSections = [];

    answers.forEach(a => {
        if (a.correctAnswer === a.studentAnswer) {
            score++;
        } else {
            const chapter = findChapterByQuestion(a.question, chapters);
            weakSections.push(chapter || "Unmapped topic (needs review)");
        }
    });

    const uniqueWeakSections = [...new Set(weakSections)];

    res.json({
        score,
        total: answers.length,
        weakAreas: uniqueWeakSections,
        recommendation: `You may need to revise: ${uniqueWeakSections.join(", ")}`
    });
});

function findChapterByQuestion(questionText, chapters) {
    questionText = questionText.toLowerCase();
    let bestMatch = null;

    chapters.forEach(ch => {
        const chapterTextLower = ch.content.toLowerCase();
        const keywords = questionText.split(/\s+/).filter(w => w.length > 3);
        const matchCount = keywords.filter(k => chapterTextLower.includes(k)).length;

        if (matchCount > 0) {
            if (!bestMatch || matchCount > bestMatch.count) {
                bestMatch = { chapter: ch.chapterTitle, count: matchCount };
            }
        }
    });

    return bestMatch ? bestMatch.chapter : null;
}

module.exports = router;
