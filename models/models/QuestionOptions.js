const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuestionOptionSchema = Schema({
    "QuestionID": {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Question',
    },
    "Value": {
        type: String
    },
    "order": {
        type:Number,
        default: 1
    }
}, { timestamps: true });

const QuestionOption = mongoose.model('QuestionOption',QuestionOptionSchema);
module.exports = QuestionOption; 