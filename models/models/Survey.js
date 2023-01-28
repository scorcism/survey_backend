const mongoose = require('mongoose');
const { Schema } = mongoose;

const SurveySchema = Schema({
    "name": {
        type: String
    },
    "startDate": {
        type: Date
    },
    "minResponses": {
        type: Number
    },
    "SurveyStatusID": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyStatus',
    },
    "endDate": {
        type: Date
    },
    "maxResponses": {
        type: Number
    },
    "description": {
        Type: String
    }
}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
module.exports = Survey; 