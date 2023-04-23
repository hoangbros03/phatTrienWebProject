const logger = require('../logger/logger');
const {"model": CarOwner, carOwnerSchema }= require('../models/CarOwner');
const {"model": Region, regionSchema} = require('../models/Region');
const {"model": PaperOfRecognition, PaperOfRecognitionSchema} = require('../models/PaperOfRecognition');
const {"model": RegistrationInformation, RegistrationInfoSchema} = require("../models/RegistrationInformation");
const {"model":TrungTamDangKiem, trungTamDangKiemSchema}= require("../models/TrungTamDangKiem");
const {"model": Car, carSchema} = require("../models/Car");
const carsController = require("../controllers/carsController");
const mongoose = require("mongoose");

//Let user update his/her information (address, ID,...) (not tested)
/*
Input: 
ownerName: String, contain at least 2 words (will check via regex)
organization : Bool
Address: String
ID: String, length = 9 or 12
RegionName: String, match with db
LicensePlate: 
LicensePlateNew: Required iff region changed
Bypass: Boolean, default is false, use to change licensePlate regardless of conditions. In front-end, it should be displayed as a toggle button for car having old-form license plates and intend to get new-form licensePlate. The rest of the information is remained.
*/

const updateInformation = async(req, res)=>{
    if(!req?.body?.address || !req?.body?.ID || !req?.body?.regionName|| !req?.body?.licensePlate || !req?.body?.ownerName){
        logger.info("Not enough information, please re-check.");
        return res.sendStatus(400);
    }
    if(req.body.organization!=true && req.body.organization !=false||
        req.body.byPass !=true && req.body.byPass !=false){
        logger.info("Organization is either missing or wrong input. Try again");
        return res.sendStatus(400);
    }
    if(req.body.ID.length!=9 &&req.body.ID.length!=12){
        logger.info("ID must consist of either 9 or 12 numbers");
        return res.sendStatus(400);
    }
    if(isNaN(Number.parseInt(req.body.ID))){
        logger.info("ID must include number only");
        return res.sendStatus(400);
    }
    //check region name
    if(! await Region.findOne({regionName: req.body.regionName}).exec()){
        logger.info("Region name not found in db!");
        return res.sendStatus(400);
    }
    //check name
    if(req.body.ownerName.length <5 ||! /[A-Z][a-z]* [A-Z][a-z]*[ A-Za-z]*/.test(req.body.ownerName)){
        logger.info("Name is not valid!");
        return res.sendStatus(400);
    }
//     const    

    //search from car
    var dummyObj = {"body":{
        "searchValue": req.body.licensePlate
    }};
   
    var dummyRes ={
        "sendStatus":(i)=>{console.log(i)},
        "status":(i)=>{console.log(i)},
        "json":(result)=>{dummyRes.result = result},
        "result": {}
    };
    try{
    await carsController.searchCar(dummyObj, dummyRes).catch((err)=>{console.log(err)});
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }
    const carFound = dummyRes.result.status;
    var newLicensePlate = false;
    console.log(carFound);
    //check region name is the same or not, and change if needed
    if(carFound.regionName != req.body.regionName || req.body.byPass){
        //check valid new licensePlate
        if(!req.body.licensePlateNew){
            logger.info("New license plate isn't provided");
            return res.sendStatus(400);
        }
        //check length and regex
        if(typeof req.body.licensePlateNew !="string" ||!req.body.licensePlateNew.match(/\d{2}[A-Z]{1}-\d{3}.\d{2}/) || req.body.licensePlateNew.length !=10){
            logger.info("the new license plate form isn't correct. Please re-check!");
            return res.sendStatus(400);
        }
        newLicensePlate=true;

    }

    //check licensePlateNew match new regionName
    if(newLicensePlate){
        let regionNum = Number.parseInt(req.body.licensePlateNew.substring(0,2))
        let isRegionMatch = await Region.findOne({
            regionName: req.body.regionName,
            regionNumber: regionNum
        }).exec();
        if(!isRegionMatch){
            logger.info("region name and region number in new license plate doesn't match!");
            return res.sendStatus(400);
        }
    }

    //check the registration Information. Create new if needed
    var newRegistrationInformation = false;
    let currentDate = new Date();
    if(carFound.registrationInformation.trungTamDangKiemName == "dummy"|| newLicensePlate || carFound.registrationInformation.dateOfExpiry < currentDate.toISOString()){
        newRegistrationInformation=true;
        if(req.body.bypass){
            newRegistrationInformation=false;
        }
    }
    //minor function to decide which licensePlate should be used and can be reused
    function licensePlate(oldLi, newLi, status){
        return status? newLi: oldLi;
    }

    //change personal information
    //use transaction so document can be rollbacked
    const session = await mongoose.connection.startSession();
    await session.startTransaction();
    try{
        //new carOwner
        const newCarOwner = new CarOwner({
            organization: req.body.organization,
            name: req.body.ownerName,
            regionName: req.body.regionName,
            address: req.body.address,
            ID: req.body.ID
        });
        await newCarOwner.save().then(()=>{logger.info("Create newCarOwner successfull")}).catch((err)=>{logger.info("Error when creating newCarOwner")});
        //new registrationInformation (DUMMY FIRST!)
        if(newRegistrationInformation){
            var expD = new Date();
            expD.setTime(new Date().getTime() + 24*3600*1000);
            var qua = Math.floor(new Date().getMonth()/3)+1;
            let dummyTTDK = TrungTamDangKiem.findOne({name:"dummy"});
            if(!dummyTTDK){
                throw "ko co ttdk dummy";
            }
            var newRegistryInfo = new RegistrationInformation({
                licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
                dateOfIssue: new Date().toISOString(),
                dateOfExpiry: expD.toISOString(),
                quarter: qua,
                trungTamDangKiem: dummyTTDK._id,
                ownerName: req.body.ownerName,
                carType: carFound.registrationInformation.carType,
                trungTamDangKiemName: "dummy",
                regionName: dummyTTDK.regionName
            });
            await newRegistryInfo.save().then(()=>{logger.info("New registry created!")}).catch((err)=>{logger.info("Error when creating newRegistry")});

        }
        //new paperOfRecognition
        const newPaperOfReg = new PaperOfRecognition({
            name: req.body.ownerName,
            licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
            dateOfIssue: new Date().toISOString(),
            quarter: qua,
            engineNo: carFound.engineNo,
            classisNo: carFound.clasissNo
        });
        await newPaperOfReg.save().then(()=>{logger.info("New paper of reg created!")}).catch((err)=>{"Error when creating newPaperOfReg"});
        //change in car schema
        await Car.updateOne({licensePlate: req.body.licensePlate},{
            paperOfRecognition: newPaperOfReg._id,
            licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
            regionName: req.body.regionName,
            carOwner: newCarOwner._id,
            registrationInformation: newRegistryInfo._id
        }).then(()=>{logger.info("Car document updated!")}).catch((err)=>{logger.info("There is an error when updating car document")});
        session.commitTransaction();
    }catch(err){
        logger.info("Error: "+err);
        await session.abortTransaction();
        
    }
    //end the session
    await session.endSession();
    return res.status(200).json({"status":"ok"});
    
}

module.exports = {updateInformation};