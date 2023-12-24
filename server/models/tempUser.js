const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const TempUsers = mongoose.model('TempUsers', usersSchema);
module.exports = TempUsers;