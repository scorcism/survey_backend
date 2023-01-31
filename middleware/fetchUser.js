const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    // console.log("Inside fetchUser")
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).json({ error: "Authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Authenticate using valid token" });
    }
}


module.exports = fetchuser;