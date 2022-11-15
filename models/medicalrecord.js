const mongoose = require("mongoose");

const medicalRecordSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
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
    }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);