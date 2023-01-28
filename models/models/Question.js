const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionSchema = Schema({
    "SurveyID": {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Survey',
    },
    "QuestionTypeID": {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'QuestionType',
    },
    "Order": {
       type: Number,
       default: 1
    },
    "isMandatory": {
        type: Boolean
    },
    "QuestionText": {
        type: String
    }
}, { timestamps: true });

const Question = mongoose.model('Question',RespondantSchema);
module.exports = Question; 