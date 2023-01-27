const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');



// Route 1: create user: No Login Required: POST /api/auth/createuser
/*
*/
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 2 }),
    body('surname', "Enter Your surname").isLength({ min: 1 }),
    body('username', 'username length should >= 2').isLength({ min: 2 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password Length should >= 5').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await User.findOne({ username: req.body.username })
        if (user) {
            return res.status(400).json({ error: "User with the same username already exists" })
        }

        let salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            password: securePassword,
        })

        let data = {
            user: {
                username: user.username
            }
        }
        var authtoken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ authtoken })
    } catch (error) {
        return res.send(error)
        // res.status(500).json({ error: "Internal server error occured" })
    }
})

// Route 2: create user: No Login Required: POST /api/auth/login
/*
*/
router.post("/login", [
    body('username', 'username length should >= 2').isLength({ min: 2 }),
    body('password', 'Password Length should >= 5').isLength({ min: 5 }),
], async (req, res) => {
    console.log("In login")

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body;

    try {
        console.log("In try")

        let user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ error: "Enter a valid credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "Enter a valid credentials" })
        }

        let data = {
            user: {
                username: user.username
            }
        }
        let authtoken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ authtoken })
    } catch (error) {
        console.log("In catch")
        res.send(500).json({ error: "Internal server error occured" })
    }
})

// Route 3: Get logged in user details : POST: /api/auth/getuser - Logged in required
router.post('/getuser', fetchuser, async (req, res) => {
    // res.send(req.user)
    try {

        let username = req.user;
        const user = await User.find( username ).select("-password");
        // console.log(user)
        res.send(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error ocured" })
    }
})

module.exports = router