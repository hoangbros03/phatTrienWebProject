const logger = require('../logger/logger');
const {"model": CarOwner, carOwnerSchema }= require('../models/CarOwner');
const {"model": Region, regionSchema} = require('../models/Region');
const {"model": PaperOfRecognition, PaperOfRecognitionSchema} = require('../models/PaperOfRecognition');
const {"model": RegistrationInformation, RegistrationInfoSchema} = require("../models/RegistrationInformation");
const {"model":TrungTamDangKiem, trungTamDangKiemSchema}= require("../models/TrungTamDangKiem");
const {"model": Car, carSchema} = require("../models/Car");
const carsController = require("../controllers/carsController");
const mongoose = require("mongoose");
const vitalFunc = require('../config/vitalFunction');


//Let user update his/her information (address, ID,...) (TESTED  half, need to continue)
/*
updateInformation
Input: 
ownerName: String, contain at least 2 words (will check via regex)
organization : Bool
Address: String
ID: String, length = 9 or 12
RegionName: String, match with db
LicensePlate: 
LicensePlateNew: Required iff region changed
Bypass: Boolean, default is false, use to change licensePlate regardless of conditions. In front-end, it should be displayed as a toggle button for car having old-form license plates and intend to get new-form licensePlate. The rest of the information is remained.
trungTamDangKiemName: Ten cua trung tam dang kiem
*/

const updateInformation = async(req, res)=>{
    //check if existed
    if(!req?.body?.address || !req?.body?.ID || !req?.body?.regionName|| !req?.body?.licensePlate || !req?.body?.ownerName || !req?.body?.trungTamDangKiemName){
        logger.info("Not enough information, please re-check.");
        return res.status(400).json({"status":"Not enough information, please re-check."});
    }
    if((req.body.organization!=true && req.body.organization !=false)||(req.body.byPass !=true && req.body.byPass !=false)){
        logger.info("Organization is either missing or wrong input. Try again");
        return res.status(400).json({"status":"Organization is either missing or wrong input. Try again"});
    }
    if(req.body.ID.length!=9 &&req.body.ID.length!=12){
        logger.info("ID must consist of either 9 or 12 numbers");
        console.log(req.body.ID)
        console.log(req.body.ID.length)
        return res.status(400).json({"status":"ID must consist of either 9 or 12 numbers"});
    }
    if(isNaN(Number.parseInt(req.body.ID))){
        logger.info("ID must include number only");
        return res.status(400).json({"status":"ID must include number only"});
    }
    if(typeof req.body.trungTamDangKiemName !="string"){
        logger.info("name of ttdk not a string");
        return res.status(400).json({"status":"name of ttdk not a string"});
    }
    let check_exist_ttdk = await TrungTamDangKiem.findOne({name: req.body.trungTamDangKiemName}).exec();
    if(!check_exist_ttdk){
        logger.info("Khong tim thay ttdk");
        return res.status(400).json({"status":"Khong tim thay ttdk"});
    }
    //correctness region name and owner name cuz client is too noob 
    req.body.regionName = vitalFunc.toTitleCase(req.body.regionName.toLowerCase());
    req.body.ownerName = vitalFunc.toTitleCase(req.body.ownerName.toLowerCase());
    req.body.licensePlate = req.body.licensePlate.toUpperCase();

    //check region name
    if(! await Region.findOne({regionName: req.body.regionName}).exec()){
        logger.info("Region name not found in db!");
        return res.status(400).json({"status":"Region name not found in db!"});
    }

    //check name
    if(req.body.ownerName.length <5 ||! /^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/.test(req.body.ownerName)){
        logger.info("Name is not valid!");
        return res.status(400).json({"status":"Name is not valid!"});
    }

    var carFound = await vitalFunc.result({"searchValue": req.body.licensePlate},"/trungTamDangKiem/god/searchCar", "POST");
    if(carFound.status =="No car match"){ //mean failure
        logger.info("licensePlate isn't existed!");
        return res.status(400).json({"status":"licensePlate isn't existed!"});
    }else{
        carFound = carFound.status;
    }
    
    var oldLicensePlate = carFound.licensePlate;
    var newLicensePlate = false;

    //check region name is the same or not, and change if needed
    if(carFound.regionName != req.body.regionName || req.body.byPass){
        //check valid new licensePlate
        if(!req.body.licensePlateNew){
            logger.info("New license plate isn't provided");
            return res.status(400).json({"status":"New license plate isn't provided"});
        }
        //check length and regex
        if(typeof req.body.licensePlateNew !="string" ||!req.body.licensePlateNew.match(/\d{2}[A-Z]{1}-\d{3}.\d{2}/) || req.body.licensePlateNew.length !=10){
            logger.info("the new license plate form isn't correct. Please re-check!");
            return res.status(400).json({"status":"the new license plate form isn't correct. Please re-check!"});
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
            return res.status(400).json({"status":"region name and region number in new license plate doesn't match!"});
        }
    }
    var forceStop = false;
    //check the registration Information. Create new if needed
    var newRegistrationInformation = false;
    let currentDate = new Date();
    try{
        if(newLicensePlate || carFound.registrationInformation.dateOfExpiry < currentDate.toISOString()){
            newRegistrationInformation=true;
            if(req.body.bypass){
                newRegistrationInformation=false;
            }
        }
    }catch(err){
        logger.info("There may an error when working with carFound object, likely cause by missing info in db. System will return 400");
        forceStop=true;
        return res.status(400).json({"status":"There may an error when working with carFound object, likely cause by missing info in db. System will return 400"});
    }
    if(forceStop)return;

    //check if new car owner should be created
    //old car owner won't be removed, because it will make the system work if there are 2 people same name less infor
    var newCarOwnerCreation = false;
    var newCarOwner = await CarOwner.findOne({
        name: req.body.ownerName,
        organization: req.body.organization,
        regionName: req.body.regionName,
        address: req.body.address,
        ID: req.body.ID
    }).exec();
    if(!newCarOwner)newCarOwnerCreation =true;

    //minor function to decide which licensePlate should be used and can be reused
    function licensePlate(oldLi, newLi, status){
        return status? newLi: oldLi;
    }

    //change personal information
    //use transaction so document can be rollbacked
    const session = await mongoose.connection.startSession();
    await session.startTransaction();
    try{
        //check condition first
        let dummyTTDK = await TrungTamDangKiem.findOne({name:req.body.trungTamDangKiemName}).exec();
            
            if(!dummyTTDK){
                
                throw "ko co ttdk voi thong tin da dua";
            }
        //new carOwner
        if(newCarOwnerCreation){
            newCarOwner = new CarOwner({
                organization: req.body.organization,
                name: req.body.ownerName,
                regionName: req.body.regionName,
                address: req.body.address,
                ID: req.body.ID
            });
            await newCarOwner.save().then(()=>{logger.info("Create newCarOwner successfull")}).catch((err)=>{logger.info("Error when creating newCarOwner");
            
        return res.status(400).json({"status":"Error when creating newCarOwner"});
       
        });
        }
        var qua = Math.floor(new Date().getMonth()/3)+1;
        //new registrationInformation (DUMMY FIRST!)
        if(newRegistrationInformation){
            var expD = new Date();
            expD.setTime(new Date().getTime() + 24*3600*1000);
            
            
            console.log(carFound.registrationInformation);
            var newRegistryInfo = new RegistrationInformation({
                licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
                dateOfIssue: new Date().toISOString(),
                dateOfExpiry: expD.toISOString(),
                quarter: qua,
                trungTamDangKiem: dummyTTDK._id,
                ownerName: req.body.ownerName,
                carType: carFound.carSpecification.type,
                trungTamDangKiemName: dummyTTDK.name,
                regionName: dummyTTDK.regionName
            });
            await newRegistryInfo.save().then(()=>{logger.info("New registry created!")}).catch((err)=>{logger.info("Error when creating newRegistry:"+err)});

        }

        //delete old paperOfrecognition
        await PaperOfRecognition.deleteOne({licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate)}).then().catch((err)=>{
            logger.info("Something wrong when delete old paper of reg");
        });

        //new paperOfRecognition
        const newPaperOfReg = new PaperOfRecognition({
            name: req.body.ownerName,
            licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
            dateOfIssue: new Date().toISOString(),
            quarter: qua,
            engineNo: carFound.engineNo,
            classisNo: carFound.classisNo
        });
        
        await newPaperOfReg.save().then((doc)=>{logger.info("New paper of reg created!")}).catch((err)=>{logger.info("Error when creating newPaperOfReg:"+err)});

        //check condition before change car schema, to ensure that _id will always found
        //other fields were ok
        if(!newRegistrationInformation){
            newRegistryInfo = carFound.registrationInformation;
        }
        console.log(newPaperOfReg._id);

        //change in car schema       
        await Car.updateOne({licensePlate: req.body.licensePlate},{
            paperOfRecognition: newPaperOfReg._id,
            licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate),
            regionName: req.body.regionName,
            carOwner: newCarOwner._id,
            registrationInformation: newRegistryInfo._id
        }).then(()=>{logger.info("Car document updated!")}).catch((err)=>{logger.info("There is an error when updating car document")});

        //update all registration infomation related
        if(newLicensePlate){
        await RegistrationInformation.updateMany({licensePlate: oldLicensePlate},{licensePlate: licensePlate(req.body.licensePlate,req.body.licensePlateNew,newLicensePlate)}).then(()=>{logger.info("update license plate regis info ok")}).catch((err)=>{logger.info("There is an error when updating regis info")});
        }
        session.commitTransaction();
    }catch(err){
        logger.info("Error: "+err);
        await session.abortTransaction();
        return res.status(400).json({"status":err});
    }
    //end the session
    await session.endSession();
    return res.status(200).json({"status":"ok"});
    
}



module.exports = {updateInformation}; //NOT TESTED