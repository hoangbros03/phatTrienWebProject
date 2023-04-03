const TrungTamDangKiem = require('../models/TrungTamDangKiem');
const CucDangKiem = require('../models/CucDangKiem');
const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const { loggers } = require('winston');

const handleRefreshToken = async(req,res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt){
        loggers.info('Can\'t find jwt inside cookies');
        return res.sendStatus(401);
    }
    const refreshToken= cookies.jwt;
    //locate
    if(!cookies?.role){
        loggers.info('Can\'t find role inside cookies');
        return res.sendStatus(401);
    }
    const role = cookies.role === '2000' ? CucDangKiem : TrungTamDangKiem;

    const foundUser = await role.findOne({refreshToken: refreshToken}).exec();
    if(!foundUser){
        loggers.info('Can \'t find user when trying to refresh token');
        return res.sendStatus(403);
    }
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || foundUser.user !== decoded.user){
                logger.info('Something wrong happen when eval jwt refreshToken');
                return res.sendStatus(403);
            }
            const role = foundUser.role;
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "user": decoded.user,
                        "role":role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30m'}
            );
            res.json({roles, accessToken});

        }
    );



}
module.exports= {handleRefreshToken};