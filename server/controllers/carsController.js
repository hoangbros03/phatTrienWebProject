const {model: Cars,CarsSchema} = require('../models/Car');
const logger = require('../logger/logger');
const {model: Region,RegionSchema} = require('../models/Region');
const carTypes = require('../config/carTypes');
const {model: carSpecs, carSpecsSchema} = require('../models/CarSpecification');
const {model: paperOfRecognition, paperOfRecognitionSchema} = require('../models/PaperOfRecognition');
const {model: carOwner,carOwnerSchema} = require('../models/CarOwner');
const {model: trungTamDangKiem, trungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const {model: registrationInformation, schema: registrationInformationSchema}=require('../models/RegistrationInformation');
const brcypt = require('bcrypt');
const mongoose= require('mongoose');
const vitalFunc = require('../config/vitalFunction');
const { error } = require('winston');
const CarSpecification = require('../models/CarSpecification');
const TrungTamDangKiem = require('../models/TrungTamDangKiem');
const DEFAULT_PASSWORD_TTDK_CREATION = process.env.DEFAULT_PASSWORD_TTDK_CREATION || "123456";
const RandExp = require('randexp');
const RegistrationInformation = require('../models/RegistrationInformation');

//This is used so if 'all', we can query regardless of the value of key(s)
const correct = (i,keyword = "all", log = true)=>{
    if(typeof i !="string"){
        if(log){
            logger.info("parameter in correct function is not a string");
        }
        
        return /./;
    }
    if(i.toLowerCase()!=keyword) return new RegExp(i.toString());
    return /./;
}
//correctMonth, since the Month in js is bullshit
const correctMonth = (i) =>{
   
    i = Number(i);
    if(isNaN(i)){
        logger.info("Parameter given is not a number");
        return null;}
    return (i).toString();
    
    
}

const enoughInformationToGetList = (r)=>{
   
    if(!r?.body?.province || !r?.body?.month || !r?.body?.quarter || !r?.body?.ttdk || !r?.body?.type || !r?.body?.year || !r?.body?.carType){
        logger.info('Not enough information for querying!');
        return false;
    }
    return true;
}

const checkNoRequireInformation = (info, type) =>{
    if(info) return info;
    else{
        if(type=="string") return "";
        else if(type =="number") return 0;
        else return NaN;
    };
}

/*
getCarList:
Input: 
    month: a number or "all"
    quarter: a number or "all"
    year: year or "all"
    province: a string (it's actually regionName), case-insensitive but must be grammatically correct or "all"
    ttdk: name of ttdk or "all"
    type: Da dang kiem || sap het han || registered || nearExpire (case-insensitive, both English and Vietnamese are ok)
    carType: type of car ,case-insensitive but must be grammatically correct or "all"
Output: List of car or {"message": "car not found"} if not found
*/
const getCarsList = async(req,res)=>{
    if(!enoughInformationToGetList(req)){return res.status(400).json({"message":"Please give back-end enough information"});}
    //valid
    if(typeof req.body.month != "string" || typeof req.body.province != "string" ||typeof req.body.quarter != "string" ||typeof req.body.ttdk != "string"||typeof req.body.type != "string"||typeof req.body.year != "string"||typeof req.body.carType != "string"){
        logger.info("Either one of the input infor is not a string");
        return res.status(400).json({"status":"Either one of the input infor is not a string"});
    }
    if(typeof Number.parseInt(req.body.month)!="number"||
    typeof Number.parseInt(req.body.quarter)!="number"||
    typeof Number.parseInt(req.body.year)!="number"){
        logger.info("month or quarter or year is not a number");
        return res.status(400).json({"status":"month or quarter or year is not a number"});
    }


    //correctness
 
    req.body.carType = req.body.carType.toLowerCase();
    req.body.type = req.body.type.toLowerCase();
    req.body.province = vitalFunc.toTitleCase(req.body.province.toLowerCase());

    let cars;
    if(req.body.type=='registered' || req.body.type=="đã đăng kiểm"){
        cars = await registrationInformation.find({
            $expr: {$and:[{
                $regexMatch: {
                  input: { $toString: "$quarter" },
                  regex: correct(req.body.quarter)
                }},{
                    $regexMatch: {
                        input: { $toString: {$month: "$dateOfIssue"} },
                        regex: correct(req.body.month)
                      }
                },{
                    $regexMatch: {
                        input: { $toString: {$year: "$dateOfIssue"} },
                        regex: correct(req.body.year)
                      }
                },{
                    $regexMatch:{
                        input: "$regionName",
                        regex: correct(req.body.province)
                    }
                },{
                    $regexMatch:{
                        input: "$trungTamDangKiemName",
                        regex: correct(req.body.ttdk)
                    }
                },{
                    $regexMatch:{
                        input: "$carType",
                        regex: correct(req.body.carType)
                    }
                }]}
        }).exec();
        
    }else if(req.body.type==='nearexpire' || req.body.type ==='sắp đến hạn'){
        //in less than or equal to 3 month
        let curDate = new Date();
        let expireDate = new Date();
        
        expireDate = new Date(expireDate.setTime(expireDate.getTime()+(3 * 30 * 24 * 60 * 60 * 1000))); //3 month later
        // console.log(expireDate.toUTCString());
        cars = await registrationInformation.find({
            regionName: correct(req.body.province),
            $expr:{
                $and:[
                    {
                            $regexMatch:{
                                input: "$regionName",
                                regex: correct(req.body.province)
                            }
                        },{
                            $regexMatch:{
                                input: "$trungTamDangKiemName",
                                regex: correct(req.body.ttdk)
                            }
                        },{
                            $regexMatch:{
                                input: "$carType",
                                regex: correct(req.body.carType)
                            }
                        },
                        {
                            $lte:[
                                "$dateOfExpiry", expireDate
                            ]
                        },
                        {
                            $gte:[
                                "$dateOfExpiry", curDate
                            ]
                        }

                ]
            }
        }).exec();



    }else{
        //Predicted moved 
        logger.info("The predicted session has moved to statisticController.js");
       
        res.json({"status":"Predict has move to statistic part"});
        return res.status(400);
        
    }

    //return part
    if(req.body.type=='registered' || req.body.type=="đã đăng kiểm" || req.body.type=="nearexpire" || req.body.type ==='sắp đến hạn'){
        if(cars.length == 0){
            res.json({"message":"No car found."});
            return res.status(204);
        }
        return res.json(cars);
    }
    return res.json({"message":"Input not true"});
};

/*
SearchCar:
Input: searchValue (length >=4 and <=10), can remove . or -, case-insensitive
Output: a car that match or {"status":"No car match"}
*/
const searchCar = async(req,res)=>{ 
    //check search length
    if(!req?.body?.searchValue){
        logger.info("Not found searchValue");
        return res.status(400).json({"status":"Not found searchValue"});
    }
    if(typeof req.body.searchValue !="string"){
        logger.info("searchValue not a string");
        return res.status(400).json({"status":"searchValue not a string"});
    }
    if(req.body.searchValue.length<=3){
        logger.info("Too short to find!");
        return res.status(400).json({"status":"Too short to find!"});
       
    }
    if(req.body.searchValue.length>10){
        logger.info("Too long to find!");
        return res.status(400).json({"status":"Too long to find!"});
    }
    //correctness
    req.body.searchValue = req.body.searchValue.toUpperCase();
    //process the search
    let value;
    if(req.body.searchValue.length == 10){ value= req.body.searchValue;
    }else if(req.body.searchValue.length<10){
        //create regex
        let pattern ="";
        pattern+='[a-zA-Z0-9.-]*';
        
        for(let i =0;i<req.body.searchValue.length;i++){
            pattern+=req.body.searchValue[i];
            pattern+='[-.]*';
        }
        pattern+='[a-zA-Z0-9.-]*';
        value = new RegExp(pattern);
        
    }
    //find
    const car = await Cars.findOne({
        licensePlate: value
    }).populate({
        path: 'paperOfRecognition',
        select: 'dateOfIssue'
    }).populate({
        path: 'carOwner',
        select: 'organization name address ID'
    }).populate({
        path:'registrationInformation',
        select: 'dateOfIssue dateOfExpiry quarter',
        populate:{
            path: 'trungTamDangKiem',
            select: 'name regionName'
        }
    }).populate({
        path: 'carSpecification',
    }).exec();
    
    
    //return
    if(!car){
        logger.info("No car match the search");
        return res.status(200).json({"status":"No car match"});
    }else{
        //Get registration informations in history
        try{
            const lp  = car.licensePlate;
        
            const regisInfor  = await registrationInformation.find({
                licensePlate: lp
            }).exec();
            var fullInfoCar = car.toObject();
            fullInfoCar.historyRegistrationInformation = regisInfor;
        }catch(err){
            logger.info("err when get registration informations in the history:"+err);
            return res.status(400).json({"status":"err when get registration informations in the history:"});
        }
        
    }
    
    res.json({"status": fullInfoCar});
    return res.status(200);
}

//create car (first time dk)
/*
    - WARNING: Car creation DOESN'T MEAN it registered
    - Required fields: 
        + organization: True|False
        + ownerName: (organization or personal)
        + licensePlate: 
        + dateOfIssue: Date() object
        + regionName:
        + carName: a string
        + carVersion a string
        + carType: xe tai hay xe con hay xe gi do 
        + engineNo: So may - string 
        + classisNo: So khung - string 
        + trungTamDangKiemName: string
        + expire (NOT REQUIRED): string. It is the month after date of issue. If not set, regis info will expired after 1 year. Can't be 0



*/
const createCar = async(req,res)=>{
    //check if enough information
    if(!"organization" in req?.body || !req?.body?.ownerName || !req?.body?.licensePlate || !req?.body?.dateOfIssue || !req?.body?.regionName || !req?.body?.carName || !req?.body?.carVersion || !req?.body?.carType ||!req?.body?.engineNo || !req?.body?.classisNo ||!req?.body?.trungTamDangKiemName){
        logger.info('Not enough information to create a car');
        return res.status(400).json({"status":"Not enough information to create a car"});
    }
    //check if information is valid 
    //1. organization
    if(req.body.organization!=true && req.body.organization!=false){
        logger.info('Must be a boolean regard to organization or not!');
        return res.status(400).json({"status":"Must be a boolean regard to organization or not!"});
    }
    //2. ownerName
    //correctness
    req.body.ownerName = vitalFunc.toTitleCase(req.body.ownerName.toLowerCase());
    if(typeof req.body.ownerName != "string" || req.body.ownerName.length <5 || !req.body.ownerName.match(/^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/)){
        logger.info('ownerName must be a string and have a proper length (full name) and space between first name and last name!');
        return res.status(400).json({"status":"ownerName must be a string and have a proper length (full name) and space between first name and last name!"});
    }
    //3. licensePlate
    //correctness
    if(typeof req.body.licensePlate !="string"){
        logger.info("licensePlate is not a string");
        return res.status(400).json({"status":"licensePlate is not a string"});
    }
    req.body.licensePlate = req.body.licensePlate.toUpperCase();
    if((!req.body.licensePlate.match(/\d{2}[A-Z]-\d{3}.\d{2}$/)&&!req.body.licensePlate.match(/\d{2}[A-Z]-\d{4}$/))){
        logger.info("the licensePlate is not a proper syntax. Please check again");
        return res.status(400).json({"status":"the licensePlate is not a proper syntax. Please check again"});
    }
    //check licensePlate contained
    if(await Cars.findOne({licensePlate: req.body.licensePlate})){
        logger.info("the licensePlate was registered, choose other number");
        return res.status(400).json({"status":"the licensePlate was registered, choose other number"});
    };
    
    //get 2 first number and check if it is valid
    let regionNumber = Number(req.body.licensePlate.substring(0,2));
    if(isNaN(regionNumber)){ //actually can't happen
        logger.info('the licensePlate is either not a string or not a proper syntax. Please check again');
        return res.status(400).json({"status":"the licensePlate is either not a string or not a proper syntax. Please check again"});
    }
    //4. dateOfIssue
    if(!req.body.dateOfIssue instanceof String){
        logger.info("dateOfIssue hien ko phai la string. Tk hung m check lai xem");
        return res.status(400).json({"status":"dateOfIssue hien ko phai la string. Tk hung m check lai xem"});

    }else{
        let checkValidDateString = Date.parse(req.body.dateOfIssue);
        if(isNaN(checkValidDateString)){
            logger.info("dateOfIssue string is not valid to convert to Date object");
            return res.status(400).json({"status":"dateOfIssue string is not valid to convert to Date object"});
        }
        
    }
    
    //5. regionName
    if(typeof req.body.regionName != "string"){
        logger.info("region Name is not a string. Please check again");
        return res.status(400).json({"status":"region Name is not a string. Please check again"});
    }
    //check region
    //correctness
    req.body.regionName = vitalFunc.toTitleCase(req.body.regionName.toLowerCase());
    const checkRegion = await Region.findOne({regionName: req.body.regionName, regionNumber: regionNumber}).exec();
    if(!checkRegion){
        logger.info("region number and name don't match. Please try again");
        return res.status(400).json({"status":"region number and name don't match. Please try again"});
    }
   
    
    //6. carName
    if(typeof req.body.carName !="string"){
        logger.info("car name must be a string");
        return res.status(400).json({"status":"car name must be a string"});
    }
    //7. carVersion
    if(typeof req.body.carVersion != "string"){
        logger.info("car version must also be a string");
        return res.status(400).json({"status":"car version must also be a string"});
    }
    //8. carType
    //correctness
    if(typeof req.body.carType !="string"){
        logger.info("car type is nether a string nor included in car Type");
        return res.status(400).json({"status":"car type is nether a string nor included in car Type"});
    }
    req.body.carType = req.body.carType.toLowerCase();
    if(!carTypes.includes(req.body.carType)){
        logger.info("car type is nether a string nor included in car Type");
        return res.status(400).json({"status":"car type is nether a string nor included in car Type"});
    }
    //9. Engine No and classis No
    if(typeof req.body.engineNo !="string" ||typeof req.body.classisNo !="string"){
        logger.info("car engine or classis no is not a string");
        return res.status(400).json({"status":"car engine or classis no is not a string"});
    }
    //10. TTDK name
    if(typeof req.body.trungTamDangKiemName != "string"){
        logger.info("Trung tam dang kiem name is not a string");
        return res.status(400).json({"status":"Trung tam dang kiem name is not a string"});
    }
    // find ttdk
    let ttdk_found = await trungTamDangKiem.findOne({name: req.body.trungTamDangKiemName}).exec();
    if(!ttdk_found){
        logger.info("Can't find ttdk in DB");
        return res.status(400).json({"status":"Can't find ttdk in DB"});
    }
    // expire time
    var expireAfter = 365*3600*1000;
    //11. expire
    if(req?.body?.expire){
        if(isNaN(Number(req.body.expire))){
            logger.info("expire provided, but not a number");
            return res.status(400).json({"status":"expire provided, but not a number"});
        }
        req.body.expire = Number(req.body.expire);
        if(req.body.expire === 0){
            logger.info("Expire can't be 0");
            return res.status(400).json({"status":"Expire can't be 0"});
        }
        expireAfter = req.body.expire * 30 * 3600 * 1000;
    }
    //declare high scope variable
    let newPaper;
    let carSpecification;
    
    let carOwn;
    // Not dummy anymore, but keep the variable name
    let newDummyDK;
    //check if it existed in carSpec
    let carSpecCheck = await carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType}).exec();
    if(!carSpecCheck){
        logger.info("car specs isn't existed in db. Please re-check your information");
        return res.status(400).json({"status":"car specs isn't existed in db. Please re-check your information"});
    }
    //check if subdocument is ready (create subdocument)
    var forceStop = false;
    //1. Paper of recognition
    if(await paperOfRecognition.findOne({name: req.body.ownerName, licensePlate: req.body.licensePlate}).exec()){
        logger.info("This car has already recognized");
        return res.status(400).json({"status":"This car has already recognized"});
    }
    //2. Car owner
    carOwn = await carOwner.findOne({organization: req.body.organization, name: req.body.ownerName, regionName: req.body.regionName}).exec();
    if(!carOwn){
        let address = "", ID= "";
        if(req?.body?.address) address = req.body.adress;
        if(req?.body?.ID) ID = req.body.ID;
        //Check if ID is valid, allow for update later
        if(ID!=""){
            if(!req.body.ID.length==9 && !req.body.ID.length==12){
                logger.info("ID length invalid, please update later!");
                ID = "";
            }
            if(isNaN(Number.parseInt(req.body.ID))){
                logger.info("ID not a set of numbers, please update later!");
                ID="";
            }
        }
        carOwn = new carOwner({
            organization: req.body.organization,
            name: req.body.ownerName,
            regionName: req.body.regionName,
            address: address,
            ID: ID
        });
        await carOwn.save().then((doc)=>{
            logger.info("Create successful car owner for: " + doc);}
        ).catch(
            (err)=>{
                logger.info("error when creating newOwner");
                forceStop =true;
                return res.status(400).json({"status":"error when creating newOwner"});
            });
    };
    if(forceStop)return;

    
    //4. car specification (must already have)
    carSpecification = await carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType}).exec();
    if(!carSpecification){
        logger.info("this car info isn't existed. Re-check the information. Remember that carSpec must be CASE-SENSITIVE. CONVERT TO CORRECT CASE NOT SUPPORTED");
        return res.status(400).json({"status":"this car info isn't existed. Re-check the information. Remember that carSpec must be CASE-SENSITIVE. CONVERT TO CORRECT CASE NOT SUPPORTED"});
    }
    //Everything is good, Now create paperOfRecognition! (good practice: Check everything before work with db)
    let aDate = new Date(req.body.dateOfIssue);
    //get quarter
    let qua = aDate.getMonth()/3 +1;
    //create new documnent
    newPaper = new paperOfRecognition({
        name: req.body.ownerName,
        licensePlate: req.body.licensePlate,
        dateOfIssue: aDate,
        quarter: qua,
        engineNo: req.body.engineNo,
        classisNo: req.body.classisNo
    });
    //save
    await newPaper.save().then((paper)=>{
        logger.info("Add document successfully!");
    }
    ).catch((err)=>{
        logger.info("There is an error when creating new document to save to the model: "+err);
        forceStop = true;
        return res.status(400).json({"status":"There is an error when creating new document to save to the model: "});
    });
    if(forceStop)return;
    //create dummy TTDK registration
    let eDate = new Date();
    eDate.setTime(aDate.getTime()+expireAfter); // Date of expire
    let dkQua = Math.floor(aDate.getMonth()/3)+1;
    //Fixed bug Date
    newDummyDK = new registrationInformation({
        licensePlate: req.body.licensePlate,
        dateOfIssue: aDate,
        dateOfExpiry: eDate,
        quarter: dkQua,
        trungTamDangKiem: ttdk_found._id,
        ownerName: req.body.ownerName,
        carType: req.body.carType,
        trungTamDangKiemName: ttdk_found.name,
        regionName: ttdk_found.regionName,
        firstTime: true
    });
    await newDummyDK.save().then((doc)=>{
        logger.info("Add temp registry successfully");
    }).catch((err)=>{
        logger.info("There is an error when creating temp registry: "+err);
        forceStop = true;
        return res.status(400).json({"status":"There is an error when creating temp registry: "});
    });
    if(forceStop)return;
    //Explain: dummyTTDK is just a name of variable, since it equal ttdk existed in DB, or new dummyTTDK

    try{
        //create mongoose   
        const newCar = new Cars({
            paperOfRecognition: newPaper._id,
            licensePlate: req.body.licensePlate,
            regionName: req.body.regionName,
            producer: carSpecification.producer,
            version: carSpecification.version,
            carOwner: carOwn._id,
            registrationInformation: newDummyDK._id,
            carSpecification: carSpecification._id,
            engineNo: req.body.engineNo,
            classisNo: req.body.classisNo
        });
        //notify
        const result = await newCar.save().then((doc)=>{
            logger.info("New car created: "+doc);
            return res.json({"status":"success"}).status(200); 
        })
        .catch((err)=>{
            logger.info("All information valid. Potential bug when creating car?: "+err);
            return res.status(400).json({"status":"All information valid. Potential bug when creating car?: "});
        });
        
    }catch(err){
        logger.info("Err happens when make new car document: "+ err);
        return res.status(400).json({"status":"Err happens when make new car document: "});
    }
    
};

/*
Car specs creation:
    Required information:
        - Name: String - name OF THE CAR
        - Version: String (not number)
        - Type: String, but 1 of 6 types in ../config/carTypes.js
    No required information:
        - Producer: String
        - Number of seat: Number
        - Width: Number
        - Height: Number
        - Power: Number
    Except type, all other field won't be corrected (meaning case-sensitive)
*/
const createCarSpecification = async(req,res)=>{
    //check enough information
    if(!req?.body?.name || !req?.body?.version || !req?.body?.type){
        logger.info("Not enough information to create new car spec");
        return res.status(400).json({"status":"Not enough information to create new car spec"});
    }
    //check valid
    //correctness
    if(typeof req.body.type !="string"){
        logger.info("car type not a string");
        return res.status(400).json({"status":"car type not a string"});
    }
    req.body.type = req.body.type.toLowerCase();
    if(!carTypes.includes(req.body.type)){
        logger.info("Car type not existed. Check your spelling");
        return res.status(400).json({"status":"Car type not existed. Check your spelling"});
    }
    //create and notify
    const newCarSpec = new carSpecs({
        name: req.body.name,
        version: req.body.version,
        type: req.body.type,
        producer: checkNoRequireInformation(req.body.producer,"string"),
        numberOfSeats: checkNoRequireInformation(req.body.numberOfSeat,"number"),
        width: checkNoRequireInformation(req.body.width,"number"),
        height: checkNoRequireInformation(req.body.height,"number"),
        power: checkNoRequireInformation(req.body.power,"number")
    });
    await newCarSpec.save().then((err)=>{
       
        logger.info("Create newCarSpec successfully");
        res.json({"status":"success"});
    }).catch((err)=>{
            logger.info("Something wrong when creating newCarSpec: "+err);
            return res.status(400).json({"status":"Something wrong when creating newCarSpec: "});
        }       
    );
};


//Upload cars from json (remember old pattern license plate)
/*
Input: a JSON like this (please read carefully cuz I won't explain):

  "status": [
    {
      "paperOfRecognition": {
        "dateOfIssue": "2022-03-16T08:17:02.177Z"
      },
      "licensePlate": "14A-123.46",
      "regionName": "Quảng Ninh",
      "producer": "Honda",
      "version": "Sport",
      "carOwner": {
        "organization": true,
        "name": "Hoang Trần",
        "address": "",
        "ID": ""
      },
      "registrationInformation": {
        "dateOfIssue": "2023-04-22T07:30:09.216Z",
        "dateOfExpiry": "2023-04-28T07:30:09.216Z",
        "quarter": 2,
        "trungTamDangKiem": {
          "name": "Trung tâm đăng kiểm xe cơ giới 2927D",
          "regionName": "Hà Nội"
        }
      },
      "carSpecification": {
        "name": "Civic",
        "version": "Sport",
        "type": "xe con",
        "producer": "Honda",
        "numberOfSeats": 5,
        "width": 5,
        "height": 4,
        "power": 174
      },
      "engineNo": "123",
      "classisNo": "456",
      "__v": 0,
      "historyRegistrationInformation": [
        {
          "licensePlate": "14A-123.46",
          "dateOfIssue": "2022-03-16T08:17:02.177Z",
          "dateOfExpiry": "2022-03-17T08:17:02.177Z",
          "quarter": 1,
          "ownerName": "Hoang Trần",
          "carType": "xe con",
          "__v": 0,
          "regionName": "Quảng Ninh",
          "trungTamDangKiemName": "dummy"
        },
        {
         //other registration
        }
      ]
    }
  ]
}
*/
const uploadDB = async(req,res)=>{
    //check exist
    if(!req?.body?.status){
        logger.info("wrong syntax when sending request!");
        return res.status(400).json({"status":"wrong syntax when sending request!"});
    }
    if(!Array.isArray(req.body.status)){
        logger.info("Inside is not an array!");
        return res.status(400).json({"status":"Inside is not an array!"});
    }
    var carUploadedCount =0;
    var missRegistryRegistration = 0;
    for(let i = 0 ; i< req.body.status.length; i++){
        var forceCountinue = false;
        //make variable shorter
        var currentCar = req.body.status[i];
        //check exist
        if(!currentCar.carSpecification){
            logger.info("Car doesn't have carSpec and won't be added");
            continue;
        }
        if(!currentCar.carSpecification.name
            || !currentCar.carSpecification.version
            || !currentCar.carSpecification.type){
                logger.info("Car doesn't have enough carSpec info and won't be added");
                continue;
            }
        //check car spec existed
        try{
            var carSpecExisted = await CarSpecification.findOne(currentCar.carSpecification).exec();
            
        }catch(err){
            logger.info("Err: "+ err);
            continue;
        }
        //create car spec
        if(carSpecExisted){
            var [jsonObj, statusCode] = await vitalFunc.result(currentCar.carSpecification,"/trungTamDangKiem/god/carSpec","POST",false,true);
        }
        if(statusCode!=200){
            logger.info("Car spec can't be added for some reason. Processing continuting...");
                continue;
        }
        
        //check exist car info
        if(!currentCar.paperOfRecognition || !currentCar.carOwner ||
        !currentCar.paperOfRecognition?.dateOfIssue ||
        !currentCar.licensePlate||
        !currentCar.regionName||
        !currentCar.carOwner?.organization||
        !currentCar.carOwner?.name||
        !currentCar.engineNo||
        !currentCar.classisNo||
        !currentCar.carSpecification.name||
        !currentCar.carSpecification.version||
        !currentCar.carSpecification.type){
            logger.info("Car info not enough. Processing continuting...");
                continue;
        }
        //check car existed
        let carFound = await Cars.findOne({licensePlate: currentCar.licensePlate}).exec();
        if(carFound){
            logger.info("This car has already existed");
            continue;
        }

        //create car
        [jsonObj, statusCode] = await vitalFunc.result({
            "organization": currentCar.carOwner.organization,
            "ownerName": currentCar.carOwner.name,
            "licensePlate": currentCar.licensePlate,
            "dateOfIssue": currentCar.paperOfRecognition.dateOfIssue,
            "regionName": currentCar.regionName,
            "carName": currentCar.carSpecification.name,
            "carVersion": currentCar.carSpecification.carVersion,
            "carType":currentCar.carSpecification.type,
            "engineNo": currentCar.engineNo,
            "classisNo": currentCar.classisNo,
            "ID": checkNoRequireInformation(currentCar.carOwner.ID,"string"),
            "address": checkNoRequireInformation(currentCar.carOwner.address,"string")
        },"/trungTamDangKiem/god/createCar","POST",false, true);
        //check status code
        if(statusCode != 200){
            logger.info("car doesn't created for some reason. Continuting...");
            continue;
        }
        
        //remove dummy when create car
        await registrationInformation.deleteOne({
            dateOfIssue: currentCar.paperOfRecognition.dateOfIssue,
            licensePlate: currentCar.licensePlate,
            trungTamDangKiemName: "dummy",
            regionName: "dummy province"   
        }).exec();

        //check if history Reg Infor is an array
        if(!Array.isArray(currentCar.historyRegistrationInformation)){
            logger.info("historyRegistrationInformation is not an array! continuting...");
            continue;
        }
        var ID_to_add;
        var dateOfIssue_to_add = new Date("01/01/1970").toISOString();
        //loop through history information
        for(let j = 0; j < currentCar.historyRegistrationInformation.length; j++){
            //check required field inside
            if(!currentCar.historyRegistrationInformation[j].regionName || 
                !currentCar.historyRegistrationInformation[j].licensePlate ||
                !currentCar.historyRegistrationInformation[j].dateOfIssue||
                !currentCar.historyRegistrationInformation[j].dateOfExpiry||
                !currentCar.historyRegistrationInformation[j].ownerName||
                !currentCar.historyRegistrationInformation[j].carType||
                !currentCar.historyRegistrationInformation[j].trungTamDangKiemName){
                    logger.info("Info inside history reg info missing. Continuting...");
                    missRegistryRegistration+=1;
                    continue;
                }
            //check valid
            if(typeof currentCar.historyRegistrationInformation[j].regionName !="string" ||
            typeof currentCar.historyRegistrationInformation[j].licensePlate !="string"||
            typeof currentCar.historyRegistrationInformation[j].dateOfIssue !="string"||
            typeof currentCar.historyRegistrationInformation[j].dateOfExpiry !="string"||
            typeof currentCar.historyRegistrationInformation[j].ownerName !="string"||
            typeof currentCar.historyRegistrationInformation[j].carType !="string"||
            typeof currentCar.historyRegistrationInformation[j].trungTamDangKiemName !="string"){
                logger.info("Info inside history reg info not a string. Continuting...");
                missRegistryRegistration+=1;
                continue;
            }
            //check exist ttdk, create new one if need
            let TTDKexisted = await TrungTamDangKiem.findOne({regionName: currentCar.historyRegistrationInformation[j].regionName,
                name: currentCar.historyRegistrationInformation[j].trungTamDangKiemName
            }).await();
           
            if(!TTDKexisted){
                logger.info("Not found TTDK in this DB. Creating (using default password)...");
                let username = currentCar.historyRegistrationInformation[j].trungTamDangKiemName.match(/\d{4}[A-Z]{1}/g);
                if(username==null){
                    username = "admin"+ new RandExp(/\d{4}[A-Z]{1}/).gen();
                }else{
                    username = "admin"+username;
                }
                const [TTDKCreation, TTDKCreationStatusCode] = await vitalFunc.result({
                    "user": username,
                    "password": DEFAULT_PASSWORD_TTDK_CREATION,
                    "regionName": currentCar.historyRegistrationInformation[j].regionName,
                    "name": currentCar.historyRegistrationInformation[j].trungTamDangKiemName
                },"/cucDangKiem/god/center","POST",true,true);
                if(TTDKCreationStatusCode=="200"){
                    logger.info("TTDK created successfully with username: "+ TTDKCreation.username);
                }else{
                    logger.info("There is an error. Continuting...");
                    continue;
                }
            }
            
            //add new history information, save id for further purpose with newest registry
            let [registryJSON, registryStatusCode] = await vitalFunc.result({
                "licensePlate": currentCar.historyRegistrationInformation[j].licensePlate,
                "dateOfIssue": currentCar.historyRegistrationInformation[j].dateOfIssue,
                "dateOfExpiry": currentCar.historyRegistrationInformation[j].dateOfExpiry,
                "trungTamDangKiemName": currentCar.historyRegistrationInformation[j].trungTamDangKiemName,
                "regionName": currentCar.historyRegistrationInformation[j].regionName
            },"/trungTamDangKiem/god/newRegistry","POST",false,true);
            if(registryStatusCode=="200"){
                logger.info("Create registry number "+(j+1) +"successfully");
                //update id of registry in car
                if(currentCar.historyRegistrationInformation[j].dateOfIssue>dateOfIssue_to_add){
                    dateOfIssue_to_add=currentCar.historyRegistrationInformation[j].dateOfIssue;
                    //correctness
                    currentCar.historyRegistrationInformation[j].regionName = vitalFunc.toTitleCase(currentCar.historyRegistrationInformation[j].regionName.toLowerCase());
                    let regis= await registrationInformation.findOne({
                        "licensePlate": currentCar.historyRegistrationInformation[j].licensePlate,
                        "dateOfIssue": currentCar.historyRegistrationInformation[j].dateOfIssue,
                        "dateOfExpiry": currentCar.historyRegistrationInformation[j].dateOfExpiry,
                        "trungTamDangKiemName": currentCar.historyRegistrationInformation[j].trungTamDangKiemName,
                        "regionName": currentCar.historyRegistrationInformation[j].regionName
                    }).exec();
                    if(!regis){
                        logger.info("Can't find regisinfo after created...???");
                        missRegistryRegistration+=1;
                        continue;
                    }else{
                        ID_to_add = regis._id;
                    }
                    
                }
            }else{
                logger.info("There is an error when creating registry number " + (j+1) + ".");
                missRegistryRegistration+=1;
            }
        }
        
        //update count
        carUploadedCount+=1;
    }

    res.json({
        "totalCar":res.body.status.length,
        "carComplete": carUploadedCount,
        "registryMiss": missRegistryRegistration
    });
    return res.sendStatus(200);
   


};

//Export cars from json
/*
Input: Same with getCarList
month, province, quarter, ttdk, type, year, carType
Output: Cars with information like when importing cars

IMPORTANT: When to use this API:
In uploadCar page, there should a another button for export cars. In this scenario, all car in db will be exported, so ALL VALUE of Input must be ALL!
*/
const exportCars = async(req,res)=>{
    if(!enoughInformationToGetList(req)){return res.status(400).json({"message":"Please give back-end enough information"});}
    //use fetch to get registration information from existing information
    let jsonData = await vitalFunc.result(req.body,"/trungTamDangKiem/god/carList","POST",false);
    //for each registration information, append licenseplate to a list
    let licensePlateList = []
    for(let i = 0 ; i< jsonData.length;i++){
        try{
            let tempObj = jsonData[i]; //.toObject();
            licensePlateList.push(tempObj.licensePlate);
        }catch(err){
            logger.info("Error when appending licensePlate: "+err + ". Process continuting...");
        }
        
    }
    //filter to remove duplicate
    licensePlateList = [...new Set(licensePlateList)];
    console.log(licensePlateList);
    //use fetch to search cars FOR EACH licenseplate
    var returnResult=[]
    for(let i = 0;i<licensePlateList.length;i++){
        
        let car = await vitalFunc.result({"searchValue": licensePlateList[i]},"/trungTamDangKiem/god/searchCar","POST",false);
        car = car.status;
        if(car =='No car match'){
            logger.info("Registration information found but no car found. This car may be removed. Process continuting...");
            continue;
        }
        if (car._id) {
            delete car._id;
          }
        if (car.paperOfRecognition && car.paperOfRecognition._id) {
        delete car.paperOfRecognition._id;
        }
        if (car.carOwner && car.carOwner._id) {
        delete car.carOwner._id;
        }
        if (car.registrationInformation && car.registrationInformation._id) {
        delete car.registrationInformation._id;
        }        
        if (car.registrationInformation && car.registrationInformation.trungTamDangKiem && car.registrationInformation.trungTamDangKiem._id) {
        delete car.registrationInformation.trungTamDangKiem._id;
        }
        if (car.carSpecification && car.carSpecification._id) {
        delete car.carSpecification._id;
        }
        for(let j = 0;j<car.historyRegistrationInformation.length; j++){
            if(car.historyRegistrationInformation[j]._id){
                delete car.historyRegistrationInformation[j]._id;
            }
            if(car.historyRegistrationInformation[j].trungTamDangKiem){
                delete car.historyRegistrationInformation[j].trungTamDangKiem;
            }
            
        }
        //append to result list
        returnResult.push(car);
    }
    //return
    res.json({"status": returnResult});
    return res.status(200);
    

};

//Delete car 
/*
Input: licensePlate of the car, case-insensitive but must be grammatically corrected.
Output: paperOfRecognition deleted, car deleted
But Registration information and car owner are kept (to track-able in the past if needed)
*/
const deleteCar = async(req,res)=>{
    //check contain
    if(!req?.body?.licensePlate){
        logger.info("No license plate provided");
        return res.status(400).json({"status":"No license plate provided"});
    }
    //check valid
    if(typeof req.body.licensePlate!="string"){
        logger.info("License plate is not a string");
        return res.status(400).json({"status":"License plate is not a string"});
    }
    req.body.licensePlate = req.body.licensePlate.toUpperCase();
    if(!req.body.licensePlate.match(/\d{2}[A-Z]-\d{3}.\d{2}$/)&&!req.body.licensePlate.match(/\d{2}[A-Z]-\d{4}$/)){
        logger.info("licensePlate when deleting must be exactly the same. The information inputted isn't match the regex");
        return res.status(400).json({"status":"licensePlate when deleting must be exactly the same. The information inputted isn't match the regex"});
    }

    //check car contain to delete
    const alreadyExist = await Cars.findOne({
        licensePlate: req.body.licensePlate
    });
    if(!alreadyExist){
        logger.info("Car already not existed!");
        return res.status(400).json({"status":"Car already not existed!"});
    }
    


    //no check if match pattern or not, not necessary at all
    //transaction
    const session = await mongoose.connection.startSession();
    (await session).startTransaction();
    try{
        await paperOfRecognition.deleteOne({licensePlate: req.body.licensePlate}).then(()=>{logger.info("Delete successfully!")}).catch((err)=>{logger.info("An error when deleting paperOfRecognition:"+err)});
        await Cars.deleteOne({licensePlate: req.body.licensePlate}).then(()=>{logger.info("Delete successfully!")}).catch((err)=>{logger.info("An error when deleting paperOfRecognition:"+err)});
        // delete all old registration information
        await registrationInformation.deleteMany({licensePlate: req.body.licensePlate}).then(()=>{logger.info("Delete all registration information ok")}).catch((err)=>{logger.info("err: "+err);});

        await session.commitTransaction();
    }catch(err){
        logger.info("Error: "+ err);
        await session.abortTransaction();
        return res.json({"status":"failed"}).status(400);
    }
    await session.endSession();
    //return
    return res.json({"status":"success"}).status(200);
};

module.exports = {
    getCarsList, //OK, corrected
    createCar,  //OK, corrected
    searchCar,  //OK, corrected
    createCarSpecification,//OK corrected
    deleteCar,//OK, corrected
    uploadDB, //NOT TESTED YET
    exportCars, //OK, corrected
    correct //Helper function
};



