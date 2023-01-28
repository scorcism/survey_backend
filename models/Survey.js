const mongoose = require('mongoose');
const { Schema } = mongoose;

const SurveySchema = Schema({
    "name": {
        type: String
    },
    "desc": {
        Type: String
    },
    "maxResponses": {
        type: Number
        // if it hits the max response then close the form
    },
    "respondantID":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Respondant',
    },
    "status":{
        type:Boolean,
        default: 1
        //  1-> open 0 -> close
    },
    "createOn":{
        type:Date,
        default: Date.now
    }
}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
module.exports = Survey; 