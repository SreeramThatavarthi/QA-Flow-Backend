const { check, query } = require("express-validator");
const db = require("../models/db");

exports.addAnswerValidator = [
    check("postedBy")
        .not()
        .isEmpty()
        .withMessage("postedBy is required")
        .isString()
        .withMessage("only string allowed as postedBy")
        .custom((value) => {
            return db.user
                .findById(db.mongoose.Types.ObjectId(value))
                .then((user, err) => {
                    if (err || !user) {
                        return Promise.reject("User is not present");
                    }
                });
        }),
    check("questionId")
        .not()
        .isEmpty()
        .withMessage("questionId is required")
        .isString()
        .withMessage("only string allowed as questionId")
        .custom((value) => {
            return db.questions
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Question is not present");
                    }
                });
        }),
    check("body")
        .not()
        .isEmpty()
        .withMessage("body is required")
        .isString()
        .withMessage("only string allowed as body"),
]
exports.editQuestionValidator = [
    check("answerId")
        .not()
        .isEmpty()
        .withMessage("answerId is required")
        .isString()
        .withMessage("only string allowed as questionId")
        .custom((value) => {
            return db.answers
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Answer is not present");
                    }
                });
        }),
    check("body")
        .not()
        .isEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("only string allowed as title"),
];
exports.checkAnswerIdValidator = [
    query("answerId")
        .not()
        .isEmpty()
        .withMessage("answerId is required")
        .isString()
        .withMessage("only string allowed as questionId")
        .custom((value) => {
            console.log(value)
            return db.answers
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Answer is not present");
                    }
                });
        }),
];
exports.voteAnswerValidator = [
    query("answerId")
        .not()
        .isEmpty()
        .withMessage("answerId is required")
        .isString()
        .withMessage("only string allowed as answerId")
        .custom((value) => {
            console.log(value)
            return db.answers
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Answer is not present");
                    }
                });
        }),
    query('type').not().isEmpty().isString().isIn(['like', 'dislike']).withMessage("only 'like' || 'dislike' string allowed")
]