const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/medicare");

const AppointmentSchema = mongoose.Schema({

    doctor_name : String,
    patient_name: String,
    fee: Number,
    date: Date,
    time: String

});


module.exports = mongoose.model("Appointment", AppointmentSchema);