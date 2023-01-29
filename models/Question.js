const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionSchema = Schema({
    "surveyID": {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Survey',
    },
    "respondantID":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Respondant'
    },
    "questionText": {
        type: String
    },
    "createOn":{
        type:Date,
        default: Date.now
    }
}, { timestamps: true });

const Question = mongoose.model('Question',QuestionSchema);
module.exports = Question; 