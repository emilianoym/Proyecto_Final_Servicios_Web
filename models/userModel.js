const mongoose = require('mongoose');
// User Model
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['viewer', 'admin', 'technician'],
    },
    idUser: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('users', UserSchema);