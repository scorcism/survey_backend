const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const Answer = require("../models/Answer")
const Question = require("../models/Question")
const survey = require("../models/Survey")
const SurveyStatus = require("../models/SurveyStatus");
const { route } = require('./auth');

router.post("/createsurvey", fetchuser, (req, res) => {
    res.send("All Forms Endpoint")
    // create survey and return the survey id 
    // which will be stored int the localstorage and at the time of create question if will be fetched form the local storage with valid conditions
    // takes respondant id from aka middlewear the header
    // increate the count on SystemStats 
    
    /**
     * Input
     * name string
     * desc string
     * maxResponses number
     * respondantID ID
     * status boolean
     * 
    */
})

router.post("/createquestion", fetchuser, (req, res) => {
    res.send("Endpoint for create form");
    
    /*
    Survey Id - > from localhost
    Question input ->
    respondedid : form header
    
    */
   
   // take survey id from the localstorage
   // takes respondant id from the header
   // increate the count on SystemStats 
})

router.post("/answer",fetchuser,(req,res) =>{
    res.send("To add answer")
    // every question will have assciated id with id 
    // answer will be linked to the question id and respondant
    // on click of that question he will be direted to the new page in frontend eg /addanswer where the question will be fetched from the parameter of id as mentioned in the question and 
    // on that page there will be all the answers related to that question and a add answer filed 
    
    /*
    questionID
    answer
    respondantID
    */
   // increate the count on SystemStats 
})

route.put("/updatequestion/:id",(req,res)=>{
    // take the  qustion id from the question and makes the follwong changes
})

route.put("/updatesurvey/:id",(req,res)=>{
    // take the survey id and makes the following changes
    // only the survey ower will be shows the edit button which will be on the dashboard
})

router.get("/questions",(req,res)=>{
    // get all the questions in the db
})
router.get("/myquestions",fetchuser,(req,res)=>{
    // get all the questions related to the specific user
})

router.delete("/deletesurvey/:id",fetchuser,()=>{

})
router.delete("/deletequestion/:id",fetchuser,()=>{

})
router.delete("/deleteanswer/:id",fetchuser,()=>{

})



module.exports = router;


