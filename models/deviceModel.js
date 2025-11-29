const mongoose = require('mongoose');


// Device Model
const DeviceSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    id_device: {
        type: Number,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    },
    ownerId: {
        type: Number,
        required: true
    },
    installedAt: {
        type: Date,
        default: Date.now
    },
    zoneId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'offline'],
        default: 'active'
    },
    sensors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sensors'
        }
    ]
});

module.exports = mongoose.model('devices', DeviceSchema);
