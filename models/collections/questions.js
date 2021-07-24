const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },

    tags: {
        type: Array,
        default: []
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

const Questions = mongoose.model("Questions", questionsSchema);

module.exports = Questions;