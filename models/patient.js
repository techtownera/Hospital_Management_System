const mongoose = require('mongoose');


// mongoose.connect("mongodb+srv://rohansingh6395g:Fkm8ZZHNftMiTRK8@productionsite.vxgho.mongodb.net/medicare");


const PatientSchema = mongoose.Schema({

    First_Name : String,
    Last_Name: String,
    email: String,
    phone: Number,
    gender: String,
    password: String,
    role: String

})

module.exports = mongoose.model("Patient", PatientSchema);