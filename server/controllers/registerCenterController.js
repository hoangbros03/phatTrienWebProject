const {TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');
const region = require('../models/Region');

const createNewCenter = async(req,res)=>{
    const body =  req.body;
    //check required field
    if(!body['user'] || !body['encodedPassword'] || !body['regionName'] ||!body['name']){
        res.status(400).json({'message': 'user, pass, name, and region are required'});
    };

    //check duplicate
    const duplicate = await TrungTamDangKiem.findOne({name: body['name'], regionName: body['regionName']}).exec();
    if(duplicate) return res.sendStatus(409); //mean conflict
    //check regionName exist
    if(!region.findOne({regionName: body.regionName})){
        logger.info("regionName doesn't contain in the list, please check the spelling");
        return res.sendStatus(409);
    }

    try{
        const encodedPwd = await bcrypt.hash(body['encodedPassword'],10);
        
        const result = await TrungTamDangKiem.create({
            "name": body['name'],
            "user": body['user'],
            "encodedPassword": encodedPwd,
            "regionName": body['regionName'],
            "forgotPassword": false,
            "refreshToken": ''
        });
        logger.info(`New center created: ${result}`);
        res.status(201).json({'success': `New center ${body['name']} created!`});

    }catch(err){
        res.status(500).json({'message': err.message});
    }



};
module.exports = {createNewCenter};