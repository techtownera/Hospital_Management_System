const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://rohansingh6395g:Fkm8ZZHNftMiTRK8@productionsite.vxgho.mongodb.net/medicare");

const FeedbackSchema = mongoose.Schema({

    name: String,
    email: String,
    phone: Number,
    feedback: String
});

module.exports = mongoose.model("feedback", FeedbackSchema);

