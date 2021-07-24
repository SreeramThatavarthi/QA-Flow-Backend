const express = require("express");
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
    allQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    deleteAllQuestion,
    getQuestion,
    getQuestionByUser,
    votesQuestion,
    searchQuestion
} = require("../controllers/questions");
const {
    addQuestionValidator,
    editQuestionValidator,
    checkQuestionIdValidator,
    voteQuestionValidator,
    searchQuestionValidator,
} = require("../validators/questions");
const { runValidation } = require("../validators");

router.get("/questions", requireSignin, allQuestions);
router.get("/question", requireSignin, checkQuestionIdValidator, runValidation, getQuestion);
router.get("/questions/user", requireSignin, getQuestionByUser);
router.post("/new/question", requireSignin, addQuestionValidator, runValidation, addQuestion);
router.post("/search/questions", requireSignin, searchQuestionValidator, runValidation, searchQuestion)
router.put("/vote/question", requireSignin, voteQuestionValidator, runValidation, votesQuestion);
router.put("/edit/question", requireSignin, editQuestionValidator, runValidation, editQuestion);
router.delete("/delete/question", requireSignin, checkQuestionIdValidator, runValidation, deleteQuestion);
router.delete("/delete/all/question", requireSignin, deleteAllQuestion);


module.exports = router;
