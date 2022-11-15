const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 3
    }
});

reviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
reviewSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Review', reviewSchema);