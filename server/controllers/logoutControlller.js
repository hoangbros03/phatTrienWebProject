const CucDangKiem = require('../models/CucDangKiem');
const TrungTamDangKiem = require('../models/TrungTamDangKiem');
const logger = require('../logger/logger');

const handleLogout = async(req,res) =>{
    //accessToken???
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //No content

    //check refreshToken in db
    //in CucDangKiem
    //CAUTION: REFRESHTOKEN MUST BE DIFFERENT!
    const foundUser = await CucDangKiem.findOne({refreshToken: cookies.jwt}).exec();
    if(!foundUser){
        //TrungTamDangKiem
        foundUser = await TrungTamDangKiem.findOne({refreshToken: cookies.jwt}).exec();
        if(!foundUser){
            //no hope
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
            return res.sendStatus(204);

        }
    }
    foundUser.refreshToken='';
    const result = await foundUser.save();
    logger.info(`Center/CDK logged out: ${result}`);
    res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure: true});
    res.sendStatus(204);

};

module.exports={handleLogout};