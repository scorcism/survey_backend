const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionSchema = Schema({
    "question": {
        type: String
    },
    "surveyID": {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Survey',
    },
    "respondantID":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Respondant'
    },
    "createdOn":{
        type:Date,
        default: Date.now
    }
}, { timestamps: true });

const Question = mongoose.model('Question',QuestionSchema);
module.exports = Question; 