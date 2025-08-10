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
