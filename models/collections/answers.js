const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
        required: true
    },

    body: {
        type: String,
        required: true,
    },

    upVotes: {
        type: Number,
        default: 0
    },

    downVotes: {
        type: Number,
        default: 0
    },

    postedOn: {
        type: Date,
        default: Date.now()
    },
    file: {
        type: String,
        default: ''
    }

},
    { autoCreate: true }
);

const Answers = mongoose.model("Answers", newsSchema);

module.exports = Answers;