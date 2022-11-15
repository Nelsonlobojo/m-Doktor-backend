const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    speciality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality',
        required: true
    },
    medicalLicenseNumber: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: '',
        required: true
    },
    profilePicture: {
        type: String,
        default: '',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

doctorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
doctorSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Doctor', doctorSchema);