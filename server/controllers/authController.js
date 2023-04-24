const {"model": CucDangKiem, CucDangKiemSchema} = require('../models/CucDangKiem');
const {"model":TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/roles_list');
const logger = require('../logger/logger');
const handleLogin = async(req,res)=>{
    const body = req.body;
    if(!Object.values(ROLES_LIST).includes(body.role) || !body['user'] || !body['encodedPassword']){
        logger.error("Necessary information must be inputted when log in");
        return res.status(400).json({"message":"Necessary information must be inputted"});
    }
    //deny if user == god
    if(body.user=="god"){
        logger.info("Can't use this user name to login!");
        return res.sendStatus(400);
    }

    //assign to role variable
    let role = null;
    //While sample shows that an account can have many roles, it won't happen here (max 1 role per acc)
    let role_num = null;
    if(body.role==ROLES_LIST['CucDangKiem']){
        role = CucDangKiem;
        role_num = 2000;
    }else if(body.role==ROLE_LIST['TrungTamDangKiem']){
        role = TrungTamDangKiem;
        role_num=3000;
    }else{
        logger.error("Role is not allowed (this is not a place for admin, tk hung dung nghich dai nua)");
        return res.sendStatus(400);
    }

    //exec to return a promise
    const foundUser = await role.findOne({user: body.user}).exec();
    if(!foundUser){
        logger.error("Username doesn't existed in the db");
        return res.sendStatus(401);
    }

    //evaluate password
    //It can compare between hased and plain password!
    const match = await bcrypt.compare(body.encodedPassword, foundUser.encodedPassword);

    if(match){
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "user": foundUser.user,
                    "role": role_num.toString()
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20s'}

        );

        //refresh every 30 minutes
        const refreshToken = jwt.sign(
            {"user":foundUser.user},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '30m'}
        );

        //Save refreshToken for current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        logger.info(`auth successfully with ${foundUser.user}`);

        //Create secure cookie with refresh token
        //Cookies will be store in the client browser via 'cookies-parser' in server.js file
        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*60*1000});

        //add value of Role to cookie
        res.cookie('role', role_num.toString(), {httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*60*1000});


        //Grab roles and accessToken to json and send to user
        //TODO: Modified so front-end can work if needed
        res.json({role, accessToken});

    }else{
        logger.error('Unknown error happened when auth-ing');
        res.sendStatus(401);
    }




}
module.exports=  {handleLogin};