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
createNewCenter
Input:
user: username, a string
password: password not encoded, a string
regionName: regionName, case-insensitive but must be grammartically corrected
name: Name of ttdk 
Output: {'success': `New center ${body['name']} created!`,
    "username": body['user']}
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
        return res.status(400).json({"status":"Sorry, but this user name is prohibited"});
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
        return res.status(400).json({"status":"name already existed"});
    }
    //check regionName exist
    
    const testExistRegion = await region.findOne({regionName: body.regionName}).exec();
    if(!testExistRegion){
        logger.info("regionName doesn't contain in the list, please check the spelling: " + body.regionName);
        return res.status(400).json({"status":"regionName doesn't contain in the list, please check the spelling: "});
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
        res.status(400).json({"message": err});
    }
};



/*
uploadCenters: Upload a list of centers
Input: {"centers": [//a list of centers]}
Output: Info about how many center uploaded
NOTE: It is use internal only.
*/
const uploadCenters = async(req,res)=>{ 
    if(!req?.body?.centers){
        logger.info("Can't find centers");
        return res.status(400).json({"status":"Can't find centers"});
    }
    var uploaded = 0;
    const arr = req.body.centers;
    for(let e = 0; e<arr.length;e++){
        const found = await TrungTamDangKiem.findOne({name:arr[e].name});
        if(found){
            logger.info("Already existed!");
            continue;
        }
        try{
            let [jsonReturn, statusCode] = await vitalFunc.result(arr[e],"/cucDangKiem/"+ "god"+"/center","POST",false,true);
            if(statusCode=="200"){
                uploaded +=1;
            }
        }catch(err){
            logger.info("Error when uploading center " + arr[e] + " : " + err);
            continue;
        }   
    }
    res.json({"total": arr.length,
                "uploaded": uploaded});
    return res.sendStatus(200);
}

//Must verify role before requesting
/*
changePasswordCenter
input:
user: string, required
oldPassword: string, required
newPassword: string, required
bypass: bool, default dont need, set to TRUE to change regradless of oldPassword 
NOTE: It is execute only after verify role in complete version.
*/
const changePasswordCenter = async(req,res)=>{
    if(typeof req.body.user != "string"){
        logger.info("user not a string of doesn't exist. Tk hung nhap sai roi");
        return res.status(400).json({"status":"user not a string of doesn't exist. Tk hung nhap sai roi"});
    }
    if(typeof req.body.newPassword !="string" || typeof req.body.oldPassword !="string"){
        logger.info("newPassword or old password not a string or doesn't exist!");
        return res.status(400).json({"status":"newPassword or old password not a string or doesn't exist!"});
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
        return res.status(400).json({"status":"no result match the user. Tk hung nhap sai roi"});
    }
    //check if oldpassword match
    if(!bypass){
        let result = await bcrypt.compare(req.body.oldPassword,user.encodedPassword);
        if(!result){
            logger.info("Pass not match");
            return res.status(400).json({"status":"Pass not match"});
        }
    }

    const newEncodePass = await bcrypt.hash(req.body.newPassword, 10);
    const reuslt = await TrungTamDangKiem.updateOne({user: req.body.user},{encodedPassword: newEncodePass}).then((doc)=>{
        logger.info("Update successfully");
        // return res.sendStatus(200);
        return res.sendStatus(200);
        
    }).catch((err)=>{
        logger.info("There must be an error : "+err);
        return res.status(400).json({"status":"There must be an error : "});

    });
}

//Add registration information
/*
addRegistry
Information needed:
    licensePlate: String, 
    dateOfIssue: ISODate
    dateOfExpiry: ISODate
    trungTamDangKiemName: String


*/
const addRegistry = async(req,res)=>{
    //check existed
    if(!req?.body?.licensePlate || !req?.body?.dateOfIssue || !req?.body?.dateOfExpiry || !req?.body?.trungTamDangKiemName){
        logger.info("Not enough information!");
        return res.status(400).json({"status":"Không đủ thông tin"});
    }
    if(typeof req.body.licensePlate != "string" || typeof req.body.trungTamDangKiemName != "string" ){
        logger.info("Some req info must be string, but aren't");
        return res.status(400).json({"status":"Yêu cầu chưa đúng"});
    }
    //correctness
    req.body.licensePlate = req.body.licensePlate.toUpperCase();

    //ttdk name won't be corrected

    var dateOfIssue = Date.parse(req.body.dateOfIssue);
    var dateOfExpiry = Date.parse(req.body.dateOfExpiry);
    if(isNaN(dateOfExpiry)|| isNaN(dateOfIssue)||!
    dateOfExpiry instanceof Date ||! dateOfIssue instanceof Date){
        logger.info("Either dateOfIssue or dateOfExpiry is not a valid ISO date format");
        return res.status(400).json({"status":"Either dateOfIssue or dateOfExpiry is not a valid ISO date format"});
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
        return res.status(400).json({"status":"Không tìm thấy biển số xe. Vui lòng nhập lại"});
    }
    console.log(getCar);
    //do'
    const ttdk = await TrungTamDangKiem.findOne({name: req.body.trungTamDangKiemName}).exec();
    var regionOfTTDK = ttdk.regionName;
    if(!ttdk){
        logger.info("Can't find ttdk, check the spelling!");
        return res.status(400).json({"status":"Không thấy trung tâm đăng kiểm"});
    }
    try{
        var qua = Math.floor(dateOfIssue.getMonth()/3)+1;
    }catch(err){
        logger.info("Some err when get the quarter");
        return res.status(400).json({"status":"Some err when get the quarter"});
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
        regionName: regionOfTTDK
    });
    await newRegistryInfo.save().then((doc)=>{
        logger.info("Successfully create new registration information the license plate: " + req.body.licensePlate);
        
    }).catch((err)=>{
        logger.info("Err: "+err);
        forceStop =true;
        return res.status(400).json({"status":err});
    });
    if(forceStop)return;
    //add id to the current car
    await Cars.updateOne({licensePlate: req.body.licensePlate},{registrationInformation: newRegistryInfo._id}).then((doc)=>{
        logger.info("Update to car object successfully!");
        return res.sendStatus(200);
    }).catch((err)=>{
        logger.info("Err when update to car obj: "+err);
        return res.status(400).json({"status":"Err when update to car obj: "});
    });
}
/*
getCenters: Throw all ttdk in specified regionName (Not tested yet)
input: regionName, case-insensitive, grammatically corrected
*/
const getCenters = async(req,res)=>{
    if(!req.body.regionName){
        logger.info("No region specified");
        return res.status(400).json({"status":"No region specified"});
    }
    //correctness
    req.body.regionName= vitalFunc.toTitleCase(req.body.regionName.toLowerCase());

    const centers = await TrungTamDangKiem.find({regionName: req.body.regionName}).select('name').exec();
    return res.json(centers);
}

//internal: create default acc for cucDangKiem
/*
initAdmin: Internal API to create defauly acc
Run by go to specified URL with params
*/
const initAdmin = async(req,res)=>{
    if(!req?.params?.key){
        logger.info("key not found");
        return res.status(400).json({"status":"key not found"});
    }
    if(req.params.key!=SECRET_KEY_INIT){
        logger.info("key wrong");
        return res.status(400).json({"status":"key wrong"});
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
        return res.status(400).json({"status":"Error when init admin: "});
    });
    return res.sendStatus(200);
};


const getListCenter =async(req,res)=>{
    const result = await TrungTamDangKiem.find();
    return res.status(200).json(JSON.stringify(result));
}

module.exports = {
    createNewCenter, //OK, corrected
    uploadCenters, //OK, corrected
    changePasswordCenter, //OK, corrected
    getCenters, //OK, corrected
    addRegistry, //NOT TESTED
    initAdmin, //OK, corrected
    getListCenter
};