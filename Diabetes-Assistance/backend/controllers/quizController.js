import QuizResult from "../models/QuizResult.js";

/* ================= SUBMIT QUIZ ================= */

export const submitQuiz = async (req, res) => {
  try {

    const { score, totalQuestions, type } = req.body;

    const result = await QuizResult.create({
      userId: req.userId,
      score,
      totalQuestions,
      type
    });

    res.json({
      message: "Quiz submitted successfully",
      result
    });

  } catch (error) {

    console.log("Quiz submit error:", error);

    res.status(500).json({
      message: "Error submitting quiz"
    });

  }
};


/* ================= GET USER QUIZ RESULTS ================= */

export const getMyQuizResults = async (req, res) => {

  try {

    const results = await QuizResult
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(results);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching quiz results"
    });

  }

};


/* ================= QUIZ COMPARISON ================= */

export const getQuizComparison = async (req, res) => {

  try {

    const results = await QuizResult
      .find({ userId: req.userId })
      .sort({ createdAt: 1 });

    if (results.length === 0) {
      return res.json({
        message: "No quiz results found"
      });
    }

    const first = results[0];
    const latest = results[results.length - 1];

    res.json({
      initialScore: first.score,
      latestScore: latest.score,
      improvement: latest.score - first.score,
      totalQuestions: first.totalQuestions
    });

  } catch (error) {

    res.status(500).json({
      message: "Error calculating quiz comparison"
    });

  }

};