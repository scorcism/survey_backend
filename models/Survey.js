const mongoose = require('mongoose');
const { Schema } = mongoose;

const SurveySchema = Schema({
    "name": {
        type: String
    },
    "description": {
        Type: String
    },
    "startDate": {
        type: Date
    },
    "SurveyStatusID": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyStatus',
        // open or close
    },
    "endDate": {
        type: Date
    },
    "maxResponses": {
        type: Number
    },
    "RespondantID":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Respondant',
    }
}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
module.exports = Survey; 