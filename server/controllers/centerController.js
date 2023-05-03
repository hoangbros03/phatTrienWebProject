const {"model": TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const {"model": CucDangKiem, CucDangKiemSchema} = require('../models/CucDangKiem');
const {"model": Cars, carsSchema} = require('../models/Car');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');
const {"model":region,"schema": regionSchema} = require('../models/Region');
const {"model": RegistrationInformation, RegistrationInformationSchema} = require("../models/RegistrationInformation");
const vitalFunc = require('../config/vitalFunction');
const SECRET_KEY_INIT = process.env.SECRET_KEY_INIT || "0";

/*
Input:
user: username, a string
password: password not encoded, a string
regionName: regionName, case-insensitive but must be grammartically corrected
name: Name of ttdk 
*/
const createNewCenter = async(req,res)=>{
    const body =  req.body;
    // console.log(body);
    //correctness
    req.body.regionName = vitalFunc.toTitleCase(req.body.regionName.toLowerCase());
    //check required field
    if(!body['user'] || !body['password'] || !body['regionName'] ||!body['name']){
        return res.status(400).json({'message': 'user, pass, name, and region are required'});
    };
    //user can't be "god", since it is used to bypass
    if(body.user=="god"){
        logger.info("Sorry, but this user name is prohibited");
        return res.sendStatus(400);
    }

    //check duplicate
    const duplicate = await TrungTamDangKiem.findOne({
        $or: [
          { name: body['name'], regionName: body['regionName'] },
          { user: body['user']}
        ]
      }).exec();
    if(duplicate) {
        logger.info("name already existed");
        return res.sendStatus(400);
    }
    //check regionName exist
    
    const testExistRegion = await region.findOne({regionName: body.regionName}).exec();
    if(!testExistRegion){
        logger.info("regionName doesn't contain in the list, please check the spelling: " + body.regionName);
        return res.sendStatus(400);
    };
  
    
    try{
        const encodedPwd = await bcrypt.hash(body['password'],10);
        
        const result = await TrungTamDangKiem.create({
            "name": body['name'],
            "user": body['user'],
            "password": encodedPwd,
            "regionName": body['regionName'],
            "forgotPassword": false,
            "refreshToken": ''
        });
        logger.info(`New center created: ${result}`);
        res.status(201).json({'success': `New center ${body['name']} created!`,
    "username": body['user']});

    }catch(err){
        res.status(400).json({'message': err});
    }
};



//for upload list of centers
const uploadCenters = async(req,res)=>{ 
    const arr = req.body;
    for(let e = 0; e<arr.length;e++){
        const found = await TrungTamDangKiem.findOne({name:arr[e].name});
        if(found){
            logger.info("Already existed!");
            continue;
        }
        try{
            await vitalFunc.result(arr[e],"/cucDangKiem/"+ "god"+"/center","POST");
        }catch(err){
            logger.info("Error when uploading center " + arr[e] + " : " + err);
            continue;
        }   
    }
    return res.sendStatus(200);
}

//Must verify role before requesting
/*
input:
user: string, required
oldPassword: string, required
newPassword: string, required
bypass: bool, default dont need, set to TRUE to change regradless of oldPassword
no correctness needed
*/
const changePasswordCenter = async(req,res)=>{
    if(typeof req.body.user != "string"){
        logger.info("user not a string of doesn't exist. Tk hung nhap sai roi");
        return res.sendStatus(400);
    }
    if(typeof req.body.newPassword !="string" || typeof req.body.oldPassword !="string"){
        logger.info("newPassword or old password not a string or doesn't exist!");
        return res.sendStatus(400);
    }
    var bypass= false;
    if(req?.body?.bypass){
        bypass= req.body.bypass;
    }
    const user = await TrungTamDangKiem.findOne({
        user: req.body.user
    }).exec();
    if(!user){
        logger.info("no result match the user. Tk hung nhap sai roi");
        return res.sendStatus(400);
    }
    //check if oldpassword match
    if(!bypass){
        let result = await bcrypt.compare(req.body.oldPassword,user.encodedPassword);
        if(!result){
            logger.info("Pass not match");
            return res.sendStatus(400);
        }
    }

    const newEncodePass = await bcrypt.hash(req.body.newPassword, 10);
    const reuslt = await TrungTamDangKiem.updateOne({user: req.body.user},{encodedPassword: newEncodePass}).then((doc)=>{
        logger.info("Update successfully");
        // return res.sendStatus(200);
        return res.sendStatus(200);
        
    }).catch((err)=>{
        logger.info("There must be an error : "+err);
        return res.sendStatus(400);

    });
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
    //correctness
    req.body.licensePlate = req.body.licensePlate.toUpperCase();
    req.body.regionName = vitalFunc.toTitleCase(req.body.regionName.toLowerCase());
    //ttdk name won't be corrected

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
    var getCar = await Cars.findOne({licensePlate: req.body.licensePlate}).populate({
        path: "carOwner",
        select: "name"
    }).populate({
        path: "carSpecification",
        select: "type"
    }).exec();
    if(!getCar){
        let err= "Can't find car with given license plate. Please note that the licensePlate must be correct";
        logger.info(err);
        return res.status(400).json({err});
    }
   
    //do'
    const ttdk = await TrungTamDangKiem.findOne({regionName: req.body.regionName, name: req.body.trungTamDangKiemName}).exec();
    if(!ttdk){
        logger.info("Can't find ttdk, check the spelling!");
        return res.sendStatus(400);
    }
    try{
        var qua = Math.floor(dateOfIssue.getMonth()/3)+1;
    }catch(err){
        logger.info("Some err when get the quarter");
        return res.sendStatus(400);
    }
    var forceStop = false;
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
        
    }).catch((err)=>{
        logger.info("Err: "+err);
        forceStop =true;
        return res.sendStatus(400);
    });
    if(forceStop)return;
    //add id to the current car
    await Cars.updateOne({licensePlate: req.body.licensePlate},{registrationInformation: newRegistryInfo._id}).then((doc)=>{
        logger.info("Update to car object successfully!");
        return res.sendStatus(200);
    }).catch((err)=>{
        logger.info("Err when update to car obj: "+err);
        return res.sendStatus(400);
    });
}

//Throw all ttdk in specified regionName (Not tested yet)
const getCenters = async(req,res)=>{
    if(!req.body.regionName){
        logger.info("No region specified");
        return res.sendStatus(400);
    }
    //correctness
    req.body.regionName= vitalFunc.toTitleCase(req.body.regionName.toLowerCase());

    const centers = await TrungTamDangKiem.find({regionName: req.body.regionName}).select('name').exec();
    return res.json(centers);
}

//internal: create default acc for cucDangKiem
const initAdmin = async(req,res)=>{
    if(!req?.params?.key){
        logger.info("key not found");
        return res.sendStatus(400);
    }
    if(req.params.key!=SECRET_KEY_INIT){
        logger.info("key wrong");
        return res.sendStatus(400);
    }
    const found = await CucDangKiem.findOne({user: "admin"});
    if(found){
        logger.info("admin already initialized");
        return res.sendStatus(200);
    }
    const hash = await bcrypt.hash("123456",10);
    const admin = new CucDangKiem({
        user: "admin",
        name: "Cuc Dang Kiem",
        encodedPassword: hash,
        refreshToken: ""

    });
    await admin.save().then((doc)=>{logger.info("Admin initialized!")}).catch((err)=>{
        logger.info("Error when init admin: "+ err);
        return res.sendStatus(400);
    });
    return res.sendStatus(200);
};

module.exports = {
    createNewCenter, //OK, corrected
    uploadCenters, //OK, corrected
    changePasswordCenter, //OK, corrected
    getCenters, //OK, corrected
    addRegistry, //OK , corrected
    initAdmin //OK, corrected
};