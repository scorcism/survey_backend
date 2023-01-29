const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Answer = require("../models/Answer")
const Question = require("../models/Question")
const SurveyStatus = require("../models/SurveyStatus");
const Survey = require('../models/Survey');

router.get("/", (req, res) => {
    res.send("api/survey WORKING")
})

router.post("/createsurvey", fetchuser, [
    body("name", "name should be >= 5").isLength({ min: 5 }),
    body("desc", "desc should be >= 5").isLength({ min: 10 }),
], async (req, res) => {
    console.log("Inside Create Survey")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
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
    const { name, desc, maxResponses, status } = req.body;
    try {

        let s = await Survey.findOne({ name });
        if (s) {
            return res.status(400).json({ error: "Survey already exists" })
        }

        let userID = req.user.id;
        const newSurveyData = new Survey({
            name, desc, maxResponses, status, respondantID: userID
        })
        const saveNewSurvey = await newSurveyData.save();
        res.json({ "currentSurveyID": saveNewSurvey.id });
        // this survey id will be store din the localstorage
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.post("/createquestion", fetchuser, [
    body("question", "question length >= 5").isLength({ min: 5 }),
    body("surveyID", "First create a survey buddy").exists(),
], async (req, res) => {
    console.log("Endpoint for create form");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    /*
    Survey Id - > from localhost
    Question input ->
    respondedid : form header
    
    */

    // take survey id from the localstorage
    // takes respondant id from the header
    // increate the count on SystemStats 

    try {
        console.log(req.body)
        const { question, surveyID } = req.body;
        // ###
        // user id from the header
        let respondantID = req.user.id;

        // Double check for the surveyID and RespondantID
        // can be not done, not manditory
        if (surveyID.length < 10 | respondantID.length < 10) {
            return res.status(400).json({ error: "Create with valid credentials" })
        }

        // check if question already exist or not
        // for later return the survey name if exists
        let qcheck = await Question.findOne({ question });
        if (qcheck) {
            return res.status(400).json({ error: "Question already exists" })
        }
        // survey id -> in front end it will be fecthed form the localstorage and will be send here
        // after that it will be deleted from the localstorage

        const newQuestionData = await Question.create({
            question, respondantID, surveyID
        })

        const saveQuestion = await newQuestionData.save()
        res.json(saveQuestion)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.get("/question/:id", fetchuser, async (req, res) => {
    console.log(req.params.id)

    // every question will have assciated id with id 
    // answer will be linked to the question id and respondant
    // on click of that question he will be direted to the new page in frontend eg /addanswer where the question will be fetched from the parameter of id as mentioned in the question and 
    // on that page there will be all the answers related to that question and a add answer filed 
    // 

    // Get only the specific question and related answers of the question and return the falue
    // not in use though
    if (!req.params.id) {
        return res.status(400).json({ error: "Select valid questions" })
    }

    try {
        let questionID = req.params.id;
        let question = await Question.findById(questionID)

        if (!question) {
            return res.status(401).json({ error: "Not allowed" });
        }

        let answer = {};

        res.send(question)

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }

})

router.post("/answer/:id", fetchuser
, async (req, res) => {

    console.log(req.params.id)

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    // every question will have assciated id with id 
    // answer will be linked to the question id and respondant
    // on click of that question he will be direted to the new page in frontend eg /addanswer where the question will be fetched from the parameter of id as mentioned in the question and 
    // on that page there will be all the answers related to that question and a add answer filed 
    /*
    questionID
    answer
    respondantID
    */
    try {

        let qID = req.params.id;
        let question = await Question.findById(qID)
        if (!question) {
            return res.status(401).json({ error: "Not allowed" });
        }

        const {questionID, answer, respondantID} = req.body;

        const a = new Answer({
            questionID,answer,respondantID
        })
        const saveAnswer = await a.save();

        res.json(saveAnswer)

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.put("/updatequestion/:id", (req, res) => {
    // take the  qustion id from the question and makes the follwong changes
})

router.put("/updatesurvey/:id", (req, res) => {
    // take the survey id and makes the following changes
    // only the survey ower will be shows the edit button which will be on the dashboard
})

router.get("/questions", (req, res) => {
    // get all the questions in the db
})

router.get("/myquestions", fetchuser, (req, res) => {
    // get all the questions related to the specific user
})

router.delete("/deletesurvey/:id", fetchuser, () => {

})
router.delete("/deletequestion/:id", fetchuser, () => {

})
router.delete("/deleteanswer/:id", fetchuser, () => {

})



module.exports = router;


