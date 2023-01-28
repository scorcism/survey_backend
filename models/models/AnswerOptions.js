const mongoose = require('mongoose');
const {Schema} = mongoose;

const AnswerOptionsSchema = Schema({
    QuestionOptionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'QuestionOption',
    },
    AnswerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Answer',
    }
}, { timestamps: true });

const AnswerOptions = mongoose.model('AnswerOptions',AnswerOptionsSchema);
module.exports = AnswerOptions; 