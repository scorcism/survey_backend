const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = Schema({
    questionID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
    answer: {
        type:String,
    },
    respondantID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Respondant'
    },
    createOn:{
        type:Date,
        default: Date.now
    }
}, { timestamps: true });

const Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer; 