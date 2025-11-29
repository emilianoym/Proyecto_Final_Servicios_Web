const mongoose = require('mongoose');

// Sensor Model
const SensorSchema = new mongoose.Schema({

    idSensor: {
        type: Number,
        required: true,
        unique: true
    },

    type: {
        type: String,
        enum: ['temperature', 'humidity', 'co2', 'noise'],
        required: true
    },

    unit: {
        type: String,
        enum: ['°C', '%', 'ppm'],
        required: true
    },

    model: {
        type: String,
        required: true
    },

    deviceId: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('sensors', SensorSchema);
