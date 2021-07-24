const express = require("express");
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
    addAnswer,
    editAnswer,
    deleteAnswer,
    deleteAllAnswer,
    votesAnswer,
    getAnswersByUser,
    getAllAnswers
} = require("../controllers/answers");
const {
    addAnswerValidator,
    editQuestionValidator,
    checkAnswerIdValidator,
    voteAnswerValidator
} = require("../validators/answers");
const { runValidation } = require("../validators");

router.get('/answers/user', requireSignin, getAnswersByUser)
router.get('/answers', requireSignin, getAllAnswers)
router.post("/add/answer", requireSignin, addAnswerValidator, runValidation, addAnswer);
router.put("/edit/answer", requireSignin, editQuestionValidator, runValidation, editAnswer);
router.delete("/delete/answer", requireSignin, checkAnswerIdValidator, runValidation, deleteAnswer);
router.delete("/delete/all/answer", requireSignin, deleteAllAnswer);
router.put("/vote/answer", requireSignin, voteAnswerValidator, runValidation, votesAnswer);

module.exports = router;
