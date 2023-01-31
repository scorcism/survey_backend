const express = require('express')
const connectToMongo = require('./db/dbConnect')
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const cors = require('cors')

dotenv.config();
connectToMongo();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.cors())

app.get("/", (req, res) => {
    // logger.info("Working");
    // logger.verbose("Working");
    // console.log("## Working");
    res.send("/ working");
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/survey', require('./routes/surveys'))


// Capture 500 errors
app.use((err, req, res, next) => {
    res.status(500).json({error:"Internal server error"});
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

// Capture 404 erors
app.use((req, res, next) => {
    res.status(404).json({error:"Page Not Found"});
    logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})



app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})


