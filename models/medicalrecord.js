const mongoose = require("mongoose");

const medicalRecordSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    diagnosis: {
        type: String,
        required:true,
        minlength:3
    },
    treatment: {
        type: String,
        minlength:3,
        required:true
    },
    prescription: {
        type: String,
        minlength:3,
        required:true
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);