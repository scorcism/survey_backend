const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();



const connectToMongo = ()=>{
    mongoose.connect(process.env.atlasUrl2, ()=>{
        console.log("Connect-ED to db")
    })
}

module.exports = connectToMongo;