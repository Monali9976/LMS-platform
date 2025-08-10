const Material = require('../models/Material');
const QuizAttempt = require('../models/QuizAttempt');
const { findBestSectionsForQuestion, generateAdaptiveQuiz } = require('../services/sarvamClient');

async function submitQuiz(req, res) {
  try {
    const { studentId, quizId, answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ ok: false, error: 'answers missing' });

    const incorrect = answers.filter(a => a.studentAnswer !== a.correctAnswer);
    const topChunks = await Material.find().limit(60).lean();
    const mappings = [];
    for (const q of incorrect) {
      const best = await findBestSectionsForQuestion(q.questionText, topChunks);
      mappings.push({ questionId: q.questionId, questionText: q.questionText, mapping: best });
    }
    const score = answers.length - incorrect.length;
    const attempt = new QuizAttempt({ studentId, quizId, answers, mappings, score });
    await attempt.save();

    const freq = {};
    for (const m of mappings) {
      const key = m.mapping.section || (`page:${m.mapping.pageNumber || 'N/A'}`);
      freq[key] = (freq[key] || 0) + 1;
    }
    const weakSections = Object.entries(freq).map(([section, count]) => ({ section, count })).sort((a,b)=>b.count-a.count);
    const adaptiveQuiz = await generateAdaptiveQuiz(weakSections.slice(0,3), 10);

    res.json({ ok: true, score, total: answers.length, mappings, weakSections, adaptiveQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { submitQuiz };
