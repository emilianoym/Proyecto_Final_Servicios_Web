const mongoose = require('mongoose');

// Reading Model
const ReadingSchema = new mongoose.Schema({
    readingId: {
        type: Number,
        required: true,
        unique: true
    },
    idSensor: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('readings', ReadingSchema);
