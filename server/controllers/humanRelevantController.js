const logger = require('../logger/logger');
const {"model": CarOwner, carOwnerSchema }= require('../models/CarOwner');
const {"model": Region, regionSchema} = require('../models/Region');
const carsController = require("../controllers/carsController");
const mongoose = require("mongoose");
//Let user update his/her information (address, ID,...)
/*
Input: 
ownerName: String, contain at least 2 words (will check via regex)
organization : Bool
Address: String
ID: String, length = 9 or 12
RegionName: String, match with db
LicensePlate: 
LicensePlateNew: Required iff region changed
*/
const updateInformation = async(req, res)=>{
    if(!req?.body?.address || !req?.body?.ID || !req?.body?.regionName|| !req?.body?.licensePlate || !req?.body?.ownerName){
        logger.info("Not enough information, please re-check.");
        return res.sendStatus(400);
    }
    if(req.body.organization!=true && req.body.organization !=false){
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
    if(carFound.regionName != req.body.regionName){
        //check valid new licensePlate
        if(!req.body.licensePlateNew){
            logger.info("New license plate isn't provided");
            return res.sendStatus(400);
        }
        //check length and regex
        if(typeof req.body.licensePlateNew !="string" ||!req.body.licensePlateNew.match(/\d{2}[A-Z]-\d{3}.\d{2}/) || req.body.licensePlateNew.length !=10){
            logger.info("the new license plate form isn't correct. Please re-check!");
            return res.sendStatus(400);
        }
        newLicensePlate=true;

    }
    //check the registration Information. Create new if needed
    var newRegistrationInformation = false;
    let currentDate = new Date();
    if(carFound.registrationInformation.trungTamDangKiemName == "dummy"|| newLicensePlate || carFound.registrationInformation.dateOfExpiry < currentDate.toISOString()){
        newRegistrationInformation=true;
    }
    //change personal information
    //use transaction so document can be rollbacked
    const session = await mongoose.connection.startSession();
    session.startTransaction();
    try{
        //new carOwner

        //new registrationInformation (DUMMY FIRST!)

        //new paperOfRecognition
        
        //change in car schema

        session.commitTransaction();
    }catch(err){
        
        await session.abortTransaction();
        
    }
    //end the session
    session.endSession();
    
    
    
    return res.sendStatus(200).json({"status":"ok"});
    
}

module.exports = {updateInformation};