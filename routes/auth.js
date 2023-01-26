const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Route 1: create user: No Login Required: POST /api/auth/createuser
/*
*/
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 2 }),
    body('surname', "Enter Your surname").isLength({ min: 1 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password Length should >= 5').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try {
        let user = await User.findOne({ username: req.body.username })
        if (user) {
            return res.status(400).json({ error: "User with the same username already exists" })
        }

        let salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            password: securePassword,
        })

        let data  = {
            user:{
                username:user.username
            }
        }
        var authtoken = jwt.sign(data, process.env.JWT_SECRET);

        return res.send({authtoken})
    } catch (error) {
        return res.send(error)
    }
})

// login user


// get usr info


module.exports = router