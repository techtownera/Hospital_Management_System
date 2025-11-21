const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/medicare");

const FeedbackSchema = mongoose.Schema({

    name: String,
    email: String,
    phone: Number,
    feedback: String
});

module.exports = mongoose.model("feedback", FeedbackSchema);

