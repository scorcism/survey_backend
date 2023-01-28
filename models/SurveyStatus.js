const mongoose = require('mongoose');
const {Schema} = mongoose;

const SurveyStatusSchema = Schema({
    SurveyStatus: {
        type:String,
        default: "open"
        // open or close
    },
}, { timestamps: true });

const SurveyStatus = mongoose.model('SurveyStatus',SurveyStatusSchema);
module.exports = SurveyStatus; 