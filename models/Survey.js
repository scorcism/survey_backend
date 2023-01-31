const mongoose = require('mongoose');
const { Schema } = mongoose;

const SurveySchema = Schema({
    "name": {
        type: String,
        unique:true
    },
    "desc": {
        type: String
    },
    "maxResponses": {
        type: Number,
        default: 15,
    },
    "status":{
        type:Boolean,
        default: 1
    },
    "respondantID":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Respondant',
    },
    "createdBy":{
        type:String
    }
}, { timestamps: true });

const Survey = mongoose.model('survey', SurveySchema);
module.exports = Survey; 