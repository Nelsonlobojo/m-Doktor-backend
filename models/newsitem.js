const mongoose = require("mongoose");

const newsItemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    content: {
        type: String,
        required: true,
        minlength: 3
    },
    date: {
        type: Date,
        required: true
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: true
    }
});



module.exports = mongoose.model('NewsItem', newsItemSchema);