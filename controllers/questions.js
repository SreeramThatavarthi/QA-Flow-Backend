const db = require("../models/db");
const moment = require("moment-timezone");

exports.allQuestions = (req, res) => {
    try {
        db.questions.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postedBy",
                },
            },
            { $unwind: "$postedBy" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            }
        ]).then((question, err) => {
            console.log(question)
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Finding Question !",
                });
            } else {
                question.sort(function (a, b) {
                    return new Date(b.postedOn) - new Date(a.postedOn);
                });
                return res.status(200).json({
                    success: true,
                    question: question,
                });
            }
        })
    } catch (error) {

        console.error("err");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.addQuestion = (req, res) => {
    try {
        console.log(req.body)
        const data = ({ postedBy, title, body, file } = req.body);
        if (req.body.tags) {
            data.tags = req.body.tags;
        }
        data.postedOn = moment.tz(moment(), 'Asia/Kolkata').toDate();
        db.questions.create(data).then((question, err) => {
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Adding Question !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    question: {
                        ...question._doc,
                        postedOn: moment(question.postedOn).local().format("DD/MM/YYYY"),
                    },
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.editQuestion = (req, res) => {
    try {
        const toUpdate = ({ title, body, tags, file } = req.body);
        db.questions
            .findByIdAndUpdate(
                db.mongoose.Types.ObjectId(req.body.questionId),
                toUpdate, { new: true }
            )
            .then((question, err) => {
                if (err || !question) {
                    return res.status(400).json({
                        success: false,
                        message: "Error Updating Question !",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        question: {
                            ...question._doc,
                            postedOn: moment(question.postedOn).local().format("DD/MM/YYYY"),
                        },
                    });
                }
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getQuestion = (req, res) => {
    console.log("e")
    try {
        db.questions.aggregate([
            {
                $match: {
                    _id: db.mongoose.Types.ObjectId(req.query.questionId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postedBy",
                },
            },
            { $unwind: "$postedBy" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "questionId",
                    as: "answers",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "answers.postedBy",
                    foreignField: "_id",
                    as: "answerPostedBy",
                },
            },
            {
                "$project": {
                    "answerPostedBy.salt": 0,
                    "answerPostedBy.hashed_password": 0,
                }
            }
        ]).exec((err, question) => {
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Finding Question !",
                });
            } else {
                var answers = question[0].answers
                var users = question[0].answerPostedBy
                answers.forEach((answer, index) => {
                    users.some((user) => {
                        if (String(answer.postedBy) == String(user._id)) {
                            console.log('here-2')
                            answers[index].postedBy = user
                        }
                    })
                })
                delete question[0].answerPostedBy
                delete question[0].answers
                console.log(question[0])
                answers.sort(function (a, b) {
                    return new Date(b.postedOn) - new Date(a.postedOn);
                });
                return res.status(200).json({
                    success: true,
                    question: question[0],
                    answers: answers
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getQuestionByUser = (req, res) => {
    try {
        db.questions.aggregate([
            {
                $match: {
                    postedBy: db.mongoose.Types.ObjectId(req.query.userId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postedBy",
                },
            },
            { $unwind: "$postedBy" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            }
        ]).exec((err, question) => {
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Finding Question !",
                });
            } else {
                question.sort(function (a, b) {
                    return new Date(b.postedOn) - new Date(a.postedOn);
                });
                return res.status(200).json({
                    success: true,
                    questions: question,
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteQuestion = (req, res) => {
    try {
        db.questions.findByIdAndDelete(db.mongoose.Types.ObjectId(req.query.questionId)).then((question, err) => {
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Deleting Question !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Question Deleted !',
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteAllQuestion = (req, res) => {
    try {
        db.questions.deleteMany({}, (question, err) => {
            return res.status(200).json({
                err: err,
                question: question,
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.votesQuestion = (req, res) => {
    try {
        let toUpdate = {}
        if (req.query.type === 'like') {
            toUpdate = req.query.increase === 'true' ? { $inc: { 'upVotes': 1 } } : { $inc: { 'upVotes': -1 } }
        } else if (req.query.type === 'dislike') {
            toUpdate = req.query.increase === 'true' ? { $inc: { 'downVotes': 1 } } : { $inc: { 'downVotes': -1 } }
        }
        db.questions.findByIdAndUpdate(db.mongoose.Types.ObjectId(req.query.questionId), toUpdate, { new: true }).populate('postedBy').then((question, err) => {
            if (err || !question) {
                return res.status(400).json({
                    success: false,
                    message: "Error Updating Votes !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    question: question,
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.searchQuestion = (req, res) => {
    try {
        db.questions.aggregate([
            {
                $match: {
                    tags: {
                        $in: [
                            ...req.body.tags
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postedBy",
                    foreignField: "_id",
                    as: "postedBy",
                },
            },
            { $unwind: "$postedBy" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            }
        ]).then((question, err) => {
            if (err || !question) {
                return res.status(200).json({
                    success: true,
                    questions: [],
                });
            } else {
                return res.status(200).json({
                    success: true,
                    questions: question,
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}