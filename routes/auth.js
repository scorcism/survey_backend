const express = require('express');
const router = express.Router();
const Respondant = require('../models/Respondant');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');
const logger = require('../middleware/logger')



const log_ = (type, message) => {
    logger.log(`${type}`,`${message}`)
}

// Route 1: create user: No Login Required: POST /api/auth/createuser
/*
*/
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 2 }),
    body('username', 'username length should >= 2').isLength({ min: 2 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password Length should >= 5').isLength({ min: 5 }),
], async (req, res) => {
    console.log("Inside /createuser")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await Respondant.findOne({ email: req.body.email })
        if (user) {
            log_error("error","This is an apple")
            return res.status(400).json({ error: "User with the same email already exists" })
        }

        let user_name = await Respondant.findOne({ username: req.body.username })
        if (user_name) {
            return res.status(400).json({ error: "User with the same username already exists" })
        }

        let salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);

        user = await Respondant.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: securePassword,
        })

        let data = {
            user: {
                id: user.id
            }
        }
        var authtoken = jwt.sign(data, process.env.JWT_SECRET);

        log_('info',`[create user]: name: ${req.body.name} - username: ${req.body.username} - email: ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

        res.json({ authtoken })
        // res.send("At the end ")
    } catch (error) {
        // return res.send(error)
        log_('error',`[create user]: status: 500 - message: Internal server error occured - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        res.status(500).json({ error: "Internal server error occured" })
    }
})

// Route 2: create user: No Login Required: POST /api/auth/login
/*
*/
router.post("/login", [
    body('email', 'username length should >= 2').isLength({ min: 2 }),
    body('password', 'Password Length should >= 5').isLength({ min: 5 }),
], async (req, res) => {
    console.log("In login")

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        console.log("In try")

        let user = await Respondant.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: "Enter a valid credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "Enter a valid credentials" })
        }

        let data = {
            user: {
                id: user.id
            }
        }
        let authtoken = jwt.sign(data, process.env.JWT_SECRET);

        log_('info',`[login user]: email: ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

        res.json({ authtoken })
    } catch (error) {
        console.log("In catch")
        log_('error',`[create user]: status: 500 - message: Internal server error occured - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        res.send(500).json({ error: "Internal server error occured" })
    }
})

// Route 3: Get logged in user details : POST: /api/auth/getuser - Logged in required
router.post('/getuser', fetchuser, async (req, res) => {
    // res.send(req.user)
    try {
        userID = req.user.id;
        const user = await Respondant.findById(userID).select("-password");
        // console.log(user)

        log_('info',`[get user]: userID: ${req.user.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

        res.send(user);
    } catch (error) {
        console.log(error)
        log_('error',`[create user]: status: 500 - message: Internal server error occured - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        res.status(500).json({ error: "Internal server error ocured" })
    }
})

// Route 4: Get logged in user name : POST: /api/auth/getusername - Logged in required
router.get('/getusername', fetchuser, async (req, res) => {
    // res.send(req.user)
    try {
        userID = req.user.id;
        const user = await Respondant.findById(userID).select("name");
        // console.log(user)
        log_('info',`[get user name]: userID: ${req.user.id} - username: ${user.name} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

        res.send(user.name);
    } catch (error) {
        console.log(error)
        log_('error',`[create user]: status: 500 - message: Internal server error occured - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        res.status(500).json({ error: "Internal server error ocured" })
    }
})


module.exports = router