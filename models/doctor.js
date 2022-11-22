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
    bio: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
    },
    price: {
        type: Number,
        required: true,

    }
});

doctorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
doctorSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Doctor', doctorSchema);