const mongoose = require("mongoose");

const db = {}

db.mongoose = mongoose
db.user = require("./collections/user");
db.questions = require("./collections/questions")
db.answers = require("./collections/answers")

module.exports = db;
