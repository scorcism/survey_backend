const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Answer = require("../models/Answer")
const Question = require("../models/Question")
const SurveyStatus = require("../models/SurveyStatus");
const Survey = require('../models/Survey');
const logger = require('../middleware/logger')


const log_ = (type, message) => {
    logger.log(`${type}`, `${message}`)
}

router.get("/", (req, res) => {
    log_("info","Check /api/survey/")
    res.send("api/survey WORKING")
})



router.get("/getquestions", async (req, res) => {
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

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

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

router.post("/createquestion", fetchuser, [
    body("question", "question length >= 5").isLength({ min: 5 }),
    body("surveyID", "First create a survey buddy").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    

    try {
        const { question, surveyID } = req.body;

        let respondantID = req.user.id;

        if (surveyID.length < 10 | respondantID.length < 10) {
            return res.status(400).json({ error: "Create with valid credentials" })
        }

        let qcheck = await Question.findOne({ question });
        if (qcheck) {
            log_('info',`[Create Question]: Already Exists - surveyID: ${req.body.surveyID} - respondantID: ${req.body.respondantID} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            return res.status(400).json({ error: "Question already exists" })
        }
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

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

    
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

    try{

        if (!survey) {
            return res.status(404).json({ error: "Not Found" })
        }
        
        if (survey.respondantID.toString() !== req.user.id) {
            return res.status(404).json({ error: "Not Found" })
        }
        survey = await Survey.findByIdAndDelete(req.params.id);
        
        log_('info',`[Delete Survey]: respondantID: ${survey.respondantID} - Delete: ${req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        
        res.json({ message: "Survey deleted" });
    }
    catch (error){
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }

})
router.delete("/deletequestion/:id", fetchuser, async (req, res) => {

    let question = await Question.findById(req.params.id);

    try {
        if (!question) {
            return res.status(404).json({ error: "Not Found" })
        }
        
        if (question.respondantID.toString() !== req.user.id) {
            return res.status(404).json({ error: "Not Found" })
        }
        question = await question.findByIdAndDelete(req.params.id);
        
        log_('info',`[Delete Question]: respondantID: ${req.body.respondantID} - Delete: ${req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        
        res.json({ message: "Question deleted" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured");
    }
})

module.exports = router;


