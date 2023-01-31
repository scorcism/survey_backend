const mongoose = require('mongoose');
const {Schema} = mongoose;

const SurveyStatusSchema = Schema({
    SurveyStatus: {
        type:String,
        default: "open"
    },
    createOn:{
        type:Date,
        default: Date.now
    }
}, { timestamps: true });

const SurveyStatus = mongoose.model('SurveyStatus',SurveyStatusSchema);
module.exports = SurveyStatus; 