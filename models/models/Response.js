const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = Schema({
    RespondantID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Respondant'
    },
    beginDate:{
        type:Date,
    },
    endDate:{
        type:Date,

    },
    SurveyID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Survey'
    },
})

const Response = mongoose.model('Response',ResponseSchema)
module.exports = Response

