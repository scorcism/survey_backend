const mongoose = require('mongoose')
const { Schema } = mongoose

const FormSchema = Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);
module.exports = Form;