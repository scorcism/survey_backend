const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionTypeSchema = Schema({
    QuestionType: {
        type:String
    },
}, { timestamps: true });

const QuestionType = mongoose.model('QuestionType',QuestionTypeSchema);
module.exports = QuestionType; 