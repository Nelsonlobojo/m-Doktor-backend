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
    passwordHash: {
        type: String,
        required: true
    },
    speciality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality',
        required: true,
        default: null
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
        required: true,
        default: 200
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