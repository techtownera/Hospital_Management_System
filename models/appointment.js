const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://rohansingh6395g:Fkm8ZZHNftMiTRK8@productionsite.vxgho.mongodb.net/medicare");

const AppointmentSchema = mongoose.Schema({

    doctor_name : String,
    patient_name: String,
    fee: Number,
    date: Date,
    time: String

});


module.exports = mongoose.model("Appointment", AppointmentSchema);