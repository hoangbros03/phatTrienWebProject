const {"model": TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const {"model": Cars, carsSchema} = require('../models/Car');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');
const {"model":region,"schema": regionSchema} = require('../models/Region');
const {"model": RegistrationInformation, RegistrationInformationSchema} = require("../models/RegistrationInformation");

const createNewCenter = async(req,res)=>{
    const body =  req.body;
    //check required field
    if(!body['user'] || !body['encodedPassword'] || !body['regionName'] ||!body['name']){
        res.status(400).json({'message': 'user, pass, name, and region are required'});
    };

    //check duplicate
    const duplicate = await TrungTamDangKiem.findOne({
        $or: [
          { name: body['name'], regionName: body['regionName'] },
          { user: body['user']}
        ]
      }).exec();
    if(duplicate) return res.sendStatus(409); //mean conflict
    //check regionName exist
    
    const testExistRegion = await region.findOne({regionName: body.regionName}).exec();
    if(!testExistRegion){
        logger.info("regionName doesn't contain in the list, please check the spelling: " + body.regionName);
        return res.sendStatus(409);
    }else{
        console.log(testExistRegion);
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

//for upload list of centers
const uploadCenters = async(req,res)=>{
    const arr = req.body;
    try{
    arr.forEach(e=>{
        createNewCenter({'body':e},{
            "status": "",
            "json": {},
            "sendStatus": ""
        }).catch((err)=>{
            return res.sendStatus(409);
        });
    });
    }catch(err){
        logger.info("Error when importing array of centers: "+err);
        return res.sendStatus(400);
    }
}

//Must verify role before requesting
const changePasswordCenter = async(req,res)=>{
    if(typeof req.body.user != "string"){
        logger.info("user not a string of doesn't exist. Tk hung nhap sai roi");
        return res.sendStatus(400);
    }
    if(typeof req.body.newPassword !="string"){
        logger.info("newPassword not a string or doesn't exist!");
        return res.sendStatus(400);
    }
    const user = await TrungTamDangKiem.findOne({
        user: req.body.user
    }).exec();
    if(!user){
        logger.info("no result match the user. Tk hung nhap sai roi");
        return res.sendStatus(400);
    }
    const newEncodePass = await bcrypt.hash(req.body.newPassword, 10);
    user.encodedPassword = newEncodePass;
    user.save().then((doc)=>{
        logger.info("Save new password successfully for user: " + req.body.user);
    }).catch((err)=>{
        logger.info("There is an error while saving");
        return res.sendStatus(400);
    });
    res.json({"status":"success"});
}

//Add registration information
/*
Information needed:
    licensePlate: String, 
    dateOfIssue: ISODate
    dateOfExpiry: ISODate
    trungTamDangKiemName: String
    regionName: String

*/
const addRegistry = async(req,res)=>{
    //check existed
    if(!req?.body?.licensePlate || !req?.body?.dateOfIssue || !req?.body?.dateOfExpiry || !req?.body?.trungTamDangKiemName || !req?.body?.regionName){
        logger.info("Not enough information!");
        return res.sendStatus(200);
    }
    if(typeof req.body.licensePlate != "string" || typeof req.body.trungTamDangKiemName != "string" ||typeof req.body.regionName != "string" ){
        logger.info("Some req info must be string, but aren't");
        return res.sendStatus(200);
    }
    var dateOfIssue = Date.parse(req.body.dateOfIssue);
    var dateOfExpiry = Date.parse(req.body.dateOfExpiry);
    if(isNaN(dateOfExpiry)|| isNaN(dateOfIssue)||!
    dateOfExpiry instanceof Date ||! dateOfIssue instanceof Date){
        logger.info("Either dateOfIssue or dateOfExpiry is not a valid ISO date format");
        return res.sendStatus(400);
    }
    dateOfIssue = new Date(req.body.dateOfIssue);
    dateOfExpiry = new Date(req.body.dateOfExpiry);
    //check car valid
    const getCar = await Cars.findOne({licensePlate: req.body.licensePlate}).populate({
        path: "carOwner",
        select: "name"
    }).populate({
        path: "carSpecification",
        select: "type"
    }).exec();
    if(getCar.length==0){
        let err= "Can't find car with given license plate. Please note that the licensePlate must be correct";
        logger.info(err);
        return res.status(400).json({err});
    }
   
    //do'
    const ttdk = await TrungTamDangKiem.findOne({regionName: req.body.regionName, name: req.body.trungTamDangKiemName}).exec();
    try{
        var qua = Math.floor(dateOfIssue.getMonth()/3)+1;
    }catch(err){
        logger.info("Some err when get the quarter");
        return res.sendStatus(400);
    }
    
    const newRegistryInfo = new RegistrationInformation({
        licensePlate: req.body.licensePlate,
        dateOfIssue: req.body.dateOfIssue,
        dateOfExpiry: req.body.dateOfExpiry,
        quarter: qua,
        trungTamDangKiem: ttdk._id,
        ownerName: getCar.carOwner.name,
        carType: getCar.carSpecification.type,
        trungTamDangKiemName: req.body.trungTamDangKiemName,
        regionName: req.body.regionName
    });
    await newRegistryInfo.save().then((doc)=>{
        logger.info("Successfully create new registration information the license plate: " + req.body.licensePlate);
        return res.status(200).json({"status":"success" });
    }).catch((err)=>{
        logger.info("Err: "+err);
        return res.sendStatus(400);
    });
}

//Throw all ttdk in specified regionName (Not tested yet)
const getCenters = async(req,res)=>{
    if(!req.body.regionName){
        logger.info("No region specified");
        return res.sendStatus(400);
    }
    const centers = await TrungTamDangKiem.find({regionName: req.body.regionName}).select('name').exec();
    return res.json(centers);
}


module.exports = {createNewCenter, uploadCenters, changePasswordCenter, getCenters, addRegistry};