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
        // if it hits the max response then close the form
    },
    "status":{
        type:Boolean,
        default: 1
        //  1-> open 0 -> close
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