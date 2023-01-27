const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true });

const User = mongoose.model('user', UserSchema);
module.exports = User