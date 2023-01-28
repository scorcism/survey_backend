const mongoose = require('mongoose');
const {Schema} = mongoose;

const SystemStatsSchema = Schema({
    "totlaSurveys":{ 
        type:Number,
        default:0
    },
    "totalQuestions":{
        type:Number,
        default:0
    },
    
    "totalAnswers":{
        type:Number,
        default:0
    },
}, { timestamps: true });

const SystemStat = mongoose.model('Question',SystemStatsSchema);
module.exports = SystemStat; 