const mongoose = require('mongoose');
const {Schema} = mongoose;

const RespondantSchema = Schema({
    email:{
        type:String,
        unique : true,
        require: true,
    },
    name: 
    {
        type: String,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Respondant = mongoose.model('Respondant',RespondantSchema);
module.exports = Respondant; 