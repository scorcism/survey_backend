const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Answer = require("../models/Answer")
const Question = require("../models/Question")
const SurveyStatus = require("../models/SurveyStatus");
const Survey = require('../models/Survey');
const logger = require('../middleware/logger')


// used to create a log
const log_ = (type, message) => {
    logger.log(`${type}`, `${message}`)
}

router.get("/", (req, res) => {
    log_("info","Check /api/survey/")
    res.send("api/survey WORKING")
})

// no login required 
// router.get("/getsurveys", async (req, res) => {
router.get("/getquestions", async (req, res) => {
    // get all the questions in the db
    // every survey will have a questions in it
    // insted we can do is we can fetch questions and give prompt that thsi qiestion is part of thsi survey
    try {
        const questions = await Question.find();
        log_('info', `[Get All Questions]: ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.json(questions);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
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
            log_('info', `[create survey]: Already exists -  desc: ${req.body.desc} - maxResponses: ${req.body.maxResponses} - status: ${req.body.status} - respondantID: ${req.body.userID}  - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            return res.status(400).json({ error: "Survey already exists" })
        }

        let userID = req.user.id;
        const newSurveyData = new Survey({
            name, desc, maxResponses, status, respondantID: userID
        })
        const saveNewSurvey = await newSurveyData.save();

        log_('info', `[create survey]: name: ${req.body.name} - desc: ${req.body.desc} - maxResponses: ${req.body.maxResponses} - status: ${req.body.status} - respondantID: ${req.body.userID}  - ${req.originalUrl} - ${req.method} - ${req.ip}`)

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
            log_('info',`[Create Question]: Already Exists - surveyID: ${req.body.surveyID} - respondantID: ${req.body.respondantID} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            return res.status(400).json({ error: "Question already exists" })
        }
        // survey id -> in front end it will be fecthed form the localstorage and will be send here
        // after that it will be deleted from the localstorage

        const newQuestionData = await Question.create({
            question, respondantID, surveyID
        })

        const saveQuestion = await newQuestionData.save()
        
        log_('info',`[Create Question]: question: ${req.body.question} - surveyID: ${req.body.surveyID} - respondantID: ${req.body.respondantID} - ${req.originalUrl} - ${req.method} - ${req.ip}`)


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
        let answers = await Answer.find({ questionID })

        let response = { question, answers }
        log_('info',`[Get Question and all answers]: questionID: ${questionID} - Total Answers: ${Object.keys(answers).length} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        res.json(response);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }

})

router.post("/answer/:id", [
    body('answer', "Answer length should be >= 5").isLength({ min: 5 })
], fetchuser
    , async (req, res) => {

        console.log(req.params.id)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
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
                return res.status(400).json({ error: "Question doesn't exists" });
            }

            let questionID = req.params.id;
            const { answer, respondantID } = req.body;

            const a = new Answer({
                questionID, answer, respondantID
            })
            const saveAnswer = await a.save();

            log_('info',`[Give answer]: questionID: ${req.body.questionID} - respondantID: ${req.body.respondantID} - answer: ${req.body.answer} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

            res.json(saveAnswer)

        } catch (error) {
            console.error(error.message);
            return res.status(500).send("Internal server error occured");
        }
    })


router.get("/mysurveys", fetchuser, async (req, res) => {
    // get all the questions related to the specific user
    try {
        const surveys = await Survey.find({ respondantID: req.user.id })

        log_('info',`[My Surveys]: req.user.id: ${req.user.id} - Total Surveys: ${Object.keys(surveys).length} - ${req.originalUrl} - ${req.method} - ${req.ip}`)



        res.json({ surveys })
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.get("/myquestions", fetchuser, async (req, res) => {
    // get all the questions related to the specific user
    try {
        const mquestions = await Survey.find({ respondantID: req.user.id })

        log_('info',`[My Questions]: req.user.id: ${req.user.id} - Total questions: ${Object.keys(mquestions).length} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

        res.json({ mquestions })
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.delete("/deletesurvey/:id", fetchuser, async (req, res) => {
    let survey = await Survey.findById(req.params.id);

    if (!survey) {
        return res.status(404).json({ error: "Not Found" })
    }

    // check if the owner of the survey is the current user
    if (survey.respondantID.toString() !== req.user.id) {
        return res.status(404).json({ error: "Not Found" })
    }
    survey = await Survey.findByIdAndDelete(req.params.id);

    log_('info',`[Delete Survey]: respondantID: ${survey.respondantID} - Delete: ${req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

    res.json({ message: "Survey deleted" });

})
router.delete("/deletequestion/:id", fetchuser, async (req, res) => {

    let question = await Question.findById(req.params.id);

    if (!question) {
        return res.status(404).json({ error: "Not Found" })
    }

    // check if the owner of the survey is the current user
    if (question.respondantID.toString() !== req.user.id) {
        return res.status(404).json({ error: "Not Found" })
    }
    question = await question.findByIdAndDelete(req.params.id);

    log_('info',`[Delete Question]: respondantID: ${req.body.respondantID} - Delete: ${req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

    res.json({ message: "Question deleted" });
})

module.exports = router;


