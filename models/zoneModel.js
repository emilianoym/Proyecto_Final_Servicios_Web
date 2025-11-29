const mongoose = require('mongoose');
// Zone Model
const ZoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    id_zone: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('zones', ZoneSchema);