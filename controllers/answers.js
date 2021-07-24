const db = require("../models/db");
const moment = require("moment-timezone");

exports.addAnswer = (req, res) => {
    try {
        const data = ({ postedBy, questionId, body, file } = req.body);
        data.postedOn = moment.tz(moment(), 'Asia/Kolkata').toDate();
        db.answers.create(data).then((answer, err) => {
            if (err || !answer) {
                return res.status(400).json({
                    success: false,
                    message: "Error Adding Answer !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    answer: {
                        ...answer._doc,
                        postedOn: moment(answer.postedOn).local().format("DD/MM/YYYY"),
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

exports.editAnswer = (req, res) => {
    try {
        var toUpdate = ({ body, file } = req.body);
        db.answers
            .findByIdAndUpdate(db.mongoose.Types.ObjectId(req.body.answerId), toUpdate, { new: true })
            .then((answer, err) => {
                if (err || !answer) {
                    return res.status(400).json({
                        success: false,
                        message: "Error Updating Answer !",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        question: {
                            ...answer._doc,
                            postedOn: moment(answer.postedOn).local().format("DD/MM/YYYY"),
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
exports.getAnswersByUser = (req, res) => {
    try {
        db.answers.aggregate([
            {
                $match: {
                    postedBy: db.mongoose.Types.ObjectId(req.query.userId),
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "questionId",
                    foreignField: "_id",
                    as: "question",
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
            { $unwind: "$question" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            }
        ]).exec((err, answers) => {
            if (err || !answers) {
                return res.status(400).json({
                    success: false,
                    message: "Error Finding Answer !",
                });
            } else {
                answers.sort(function (a, b) {
                    return new Date(b.postedOn) - new Date(a.postedOn);
                });
                return res.status(200).json({
                    success: true,
                    answers: answers,
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

exports.getAllAnswers = (req, res) => {
    try {
        db.answers.aggregate([
            {
                $lookup: {
                    from: "questions",
                    localField: "questionId",
                    foreignField: "_id",
                    as: "question",
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
            { $unwind: "$question" },
            {
                "$project": {
                    "postedBy.salt": 0,
                    "postedBy.hashed_password": 0,
                }
            }
        ]).exec((err, answers) => {
            if (err || !answers) {
                return res.status(400).json({
                    success: false,
                    message: "Error Finding Answer !",
                });
            } else {
                answers.sort(function (a, b) {
                    return new Date(b.postedOn) - new Date(a.postedOn);
                });
                return res.status(200).json({
                    success: true,
                    answers: answers,
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

exports.deleteAnswer = (req, res) => {
    try {
        db.answers.findByIdAndDelete(db.mongoose.Types.ObjectId(req.query.answerId)).then((answer, err) => {
            if (err || !answer) {
                return res.status(400).json({
                    success: false,
                    message: "Error Deleting Answer !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Answer Deleted !',
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

exports.deleteAllAnswer = (req, res) => {
    try {
        db.answers.deleteMany({}).then((answer, err) => {
            return res.status(200).json({
                err: err,
                answer: answer,
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

exports.votesAnswer = (req, res) => {
    try {
        let toUpdate = {}
        if (req.query.type === 'like') {
            toUpdate = req.query.increase === 'true' ? { $inc: { 'upVotes': 1 } } : { $inc: { 'upVotes': -1 } }
        } else if (req.query.type === 'dislike') {
            toUpdate = req.query.increase === 'true' ? { $inc: { 'downVotes': 1 } } : { $inc: { 'downVotes': -1 } }
        }
        db.answers.findByIdAndUpdate(db.mongoose.Types.ObjectId(req.query.answerId), toUpdate, { new: true }).populate('postedBy').then((answer, err) => {
            if (err || !answer) {
                return res.status(400).json({
                    success: false,
                    message: "Error Updating Votes !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    answer: answer,
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