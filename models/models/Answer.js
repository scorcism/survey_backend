const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = Schema({
    QuestionID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
    Answer: {
        type:String,
    },
    ResponseID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Response'
    }
}, { timestamps: true });

const Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer; 