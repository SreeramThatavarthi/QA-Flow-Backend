const { check, query } = require("express-validator");
const db = require("../models/db");

exports.addQuestionValidator = [
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
    check("title")
        .not()
        .isEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("only string allowed as title"),
    check("body")
        .not()
        .isEmpty()
        .withMessage("body is required")
        .isString()
        .withMessage("only string allowed as body"),
];

exports.editQuestionValidator = [
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
    check("title")
        .not()
        .isEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("only string allowed as title"),
    check("body")
        .not()
        .isEmpty()
        .withMessage("body is required")
        .isString()
        .withMessage("only string allowed as body"),
];

exports.checkQuestionIdValidator = [
    query("questionId")
        .not()
        .isEmpty()
        .withMessage("questionId is required")
        .isString()
        .withMessage("only string allowed as questionId")
        .custom((value) => {
            console.log(value)
            return db.questions
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Question is not present");
                    }
                });
        }),
];

exports.voteQuestionValidator = [
    query("questionId")
        .not()
        .isEmpty()
        .withMessage("questionId is required")
        .isString()
        .withMessage("only string allowed as questionId")
        .custom((value) => {
            console.log(value)
            return db.questions
                .findById(db.mongoose.Types.ObjectId(value))
                .then((question, err) => {
                    if (err || !question) {
                        return Promise.reject("Question is not present");
                    }
                });
        }),
    query('type').not().isEmpty().isString().isIn(['like', 'dislike']).withMessage("only 'like' || 'dislike' string allowed")
]

exports.searchQuestionValidator = [
    check("tags").not().isEmpty().isArray().withMessage("tags array is required"),
]
