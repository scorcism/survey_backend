const express = require('express')
const connectToMongo = require('./db/dbConnect')
const dotenv = require('dotenv')
dotenv.config();

connectToMongo();

const app = express();
const PORT = 5000;

app.use(express.json());
app.get("/", (req, res) => {
    res.send("working");
    console.log("## Working");
})

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes', require('./routes/form'))

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})


