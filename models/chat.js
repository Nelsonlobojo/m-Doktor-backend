const mongoose = require ('mongoose');

const chatSchema = new mongoose.Schema ({
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },   
})

chatSchema.virtual ('id').get (function () {
    return this._id.toHexString ();
});

chatSchema.set ('toJSON', {
    virtuals: true
});

module.exports = mongoose.model ('Chat', chatSchema);