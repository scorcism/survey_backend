const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const Form = require("../models/Form");


router.get("/allform", fetchuser, (req, res) => {
    res.send("All Forms Endpoint")
})

router.post("/createform", fetchuser, (req, res) => {
    res.send("Endpoint for create form")
})



module.exports = router;


