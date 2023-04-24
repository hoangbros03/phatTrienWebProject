const {"model": TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const {"model": CucDangKiem, CucDangKiemSchema} = require('../models/CucDangKiem');
const {"model": Cars, carsSchema} = require('../models/Car');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');
const {"model":region,"schema": regionSchema} = require('../models/Region');
const {"model": RegistrationInformation, RegistrationInformationSchema} = require("../models/RegistrationInformation");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const SERVER_URL = process.env.SERVER_URL.toString() || "http://localhost:3500";

const createNewCenter = async(req,res)=>{
    const body =  req.body;
    console.log(body);
    //check required field
    if(!body['user'] || !body['encodedPassword'] || !body['regionName'] ||!body['name']){
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
//function to handle fetch API when uploading
// const result = async (e,url)=>{
    
//     new_url = SERVER_URL + url;
//     return await fetch(new_url,{
//         method: 'POST',
//         body: JSON.stringify(e),
//         headers: { 'Content-Type': 'application/json' }
//     }).then(res => res.json()).then(json => console.log(json)).catch(err=>console.log(err));
    
//     const data = await response.json();
    
// };
const result = async (e,url, method)=>{
    let jsonReturn;
    new_url = SERVER_URL + url;
    const data =  await fetch(new_url,{
        method: method,
        body: JSON.stringify(e),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(json => {jsonReturn = json}).catch(err=>console.log(err));
    console.log(jsonReturn);
    return jsonReturn;
};

//for upload list of centers
const uploadCenters = async(req,res)=>{ 
    const arr = req.body;
    
    for(let e = 0; e<arr.length;e++){
        
        await result(arr[e],"/cucDangKiem/"+ "god"+"/center","POST");   
    }
    return res.sendStatus(200);
    
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

//internal: create default acc for cucDangKiem
const initAdmin = async(req,res)=>{
    const hash = await bcrypt.hash("123456",10);
    const admin = new CucDangKiem({
        user: "admin",
        name: "Cuc Dang Kiem",
        encodedPassword: hash,
        refreshToken: ""

    });
    await admin.save();
    return res.sendStatus(200);
};

module.exports = {createNewCenter, uploadCenters, changePasswordCenter, getCenters, addRegistry, initAdmin};