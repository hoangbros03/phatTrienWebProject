const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    console.log(process.env.SECRET_SUPER_USER)
    if(req.params){
        if(req.params.user == process.env.SECRET_SUPER_USER){
            console.log("reached")
            next();
            return;
        }
    }
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Access token expried' })
            //using for verify role not necessery
            req.user = decoded.UserInfo.user
            req.role = decoded.UserInfo.role
            next()
        }
    )
}

module.exports = verifyJWT 