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
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const SERVER_URL = process.env.SERVER_URL.toString() || "http://localhost:3500";


//This is used so if 'all', we can query regardless of the value of key(s)
const correct = (i)=>{
    if(typeof i !="string"){
        logger.info("parameter in correct function is not a string");
        return /./;
    }
    if(i.toLowerCase()!="all") return new RegExp(i.toString());
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
    console.log(r?.body);
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
//month, province, quarter, ttdk, type, year, carType

//get car based on condition
/*
CAR LIST PART
*/
const getCarsList = async(req,res)=>{
    if(!enoughInformationToGetList(req)){return res.status(400).json({"message":"Please give back-end enough information"});}
    let cars;
    if(req.body.type=='registered' || req.body.type=="Đã đăng kiểm"){
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
        
    }else if(req.body.type==='nearExpire' || req.body.type ==='Sắp đến hạn'){
        //in less than or equal to 3 month

        var expireDate = new Date();
        expireDate = expireDate.setTime(expireDate.getTime()+(3 * 30 * 24 * 60 * 60 * 1000)); //3 month later
        cars = await Cars.find({
            regionName: correct(req.body.province),
            $expr:{
                $and:[
                    {$eq:['$registrationInformation.trungTamDangKiem.name',correct(req.body.ttdk)]},
                    {$eq:['$carSpecification.type',correct(req.body.carType)]},
                    {$lte:['$registrationInformation.dateOfExpiry',expireDate]}

                ]
            }
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
                select: 'name'
            }
        }).populate({
            path: 'carSpecification',
        }).exec();



    }else{
        //Predicted moved 
        logger.info("The predicted session has moved to statisticController.js");
       
        res.json({"status":"Predict has move to statistic part"});
        return res.status(400);
        
    }

    //return part
    if(req.body.type=='registered' || req.body.type=="Đã đăng kiểm" || req.body.type=="nearExpire" || req.body.type ==='Sắp đến hạn'){
        if(cars.length == 0){
            res.json({"message":"No car found."});
            return res.status(204);
        }
        // console.log(cars[0].paperOfRecognition.dateOfIssue.$month);
        return res.json(cars);
    }
    return res.json({"message":"Input not true"});
    

};

//search car
const searchCar = async(req,res)=>{ 
    //check search length
    if(!req?.body?.searchValue){
        logger.info("Not found searchValue");
        return res.sendStatus(400);
    }else if(req.body.searchValue.length<=3){
        logger.info("Too short to find!");
        return res.sendStatus(400);
       
    }else if(req.body.searchValue.length>10){
        logger.info("Too long to find!");
        return res.sendStatus(400);
    }
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
        const lp  = car.licensePlate;
        
        const regisInfor  = await registrationInformation.find({
            licensePlate: lp
        }).exec();
        var fullInfoCar = car.toObject();
        fullInfoCar.historyRegistrationInformation = regisInfor;
    }
    
    res.json({"status": fullInfoCar});
    return res.status(200);
}

//create car
/*
    WARNING: Because the creation of car has not yet existed,
    there are show vital recommendations:
    - Car creation DOESN'T MEAN it registered
    - Required fields: 
        + organization: True|False
        + ownerName: (organization or personal)
        + licensePlate: 
        + dateOfIssue: Date() object
        + regionName:
        + carName: (e.g. Toyota)
        + carVersion (e.g. khong biet lol) - still a string
        + carType: xe tai hay xe con hay xe gi do 
        + engineNo: So may - string :))
        + classisNo: So khung - string :)))
    
    - registrationInformation (thong tin dang kiem) will be set to a dummy object. This vehicle will always showed in "nearExpire" type when searching for car list



*/


const createCar = async(req,res)=>{
    //check if enough information
    if(!"organization" in req?.body || !req?.body?.ownerName || !req?.body?.licensePlate || !req?.body?.dateOfIssue || !req?.body?.regionName || !req?.body?.carName || !req?.body?.carVersion || !req?.body?.carType ||!req?.body?.engineNo || !req?.body?.classisNo){
        logger.info('Not enough information to create a car');
        return res.sendStatus(400);
    }
    //check if information is valid 
    //1. organization
    if(typeof req.body.organization != "boolean"){
        logger.info('Must be a boolean regard to organization or not!');
        return res.sendStatus(400);
    }
    //2. ownerName
    if(typeof req.body.ownerName != "string" || req.body.ownerName.length <5 || !req.body.ownerName.match(/[a-zA-Z ]* [a-zA-Z]*/)){
        logger.info('ownerName must be a string and have a proper length (full name) and space between first name and last name!');
        return res.sendStatus(400);
    }
    //3. licensePlate
    if(typeof req.body.licensePlate !="string" ||(!req.body.licensePlate.match(/\d{2}[A-Z]-\d{3}.\d{2}/)&&!req.body.licensePlate.match(/\d{2}[A-Z]-\d{4}/))){
        logger.info("the licensePlate is either not a string or not a proper syntax. Please check again");
        return res.sendStatus(400);
    }
    //check licensePlate contained
    if(await Cars.findOne({licensePlate: req.body.licensePlate})){
        logger.info("the licensePlate was registered, choose other number");
        return res.sendStatus(400);
    }
    //get 2 first number and check if it is valid
    let regionNumber = Number(req.body.licensePlate.substring(0,2));
    if(isNaN(regionNumber)){ //actually can't happen
        logger.info('the licensePlate is either not a string or not a proper syntax. Please check again');
        return res.sendStatus(400);
    }
    //4. dateOfIssue
    if(!req.body.dateOfIssue instanceof String){
        logger.info("dateOfIssue hien ko phai la string. Tk hung m check lai xem");
        return res.sendStatus(400);

    }else{
        let checkValidDateString = Date.parse(req.body.dateOfIssue);
        if(isNaN(checkValidDateString)){
            logger.info("dateOfIssue string is not valid to convert to Date object");
            return res.sendStatus(400);
        }
        
    }
    
    //5. regionName
    if(typeof req.body.regionName != "string"){
        logger.info("region Name is not a string. Please check again");
        return res.sendStatus(400);
    }
    //check region
    //Re-enable it when working

    const checkRegion = await Region.findOne({regionName: req.body.regionName, regionNumber: regionNumber}).exec();
    if(!checkRegion){
        logger.info("region number and name don't match. Please try again");
        return res.sendStatus(400);
    }
   
    
    //6. carName
    if(typeof req.body.carName !="string"){
        logger.info("car name must be a string");
        return res.sendStatus(400);
    }
    //7. carVersion
    if(typeof req.body.carVersion != "string"){
        logger.info("car version must also be a string");
        return res.sendStatus(400);
    }
    //8. carType
    if(typeof req.body.carType !="string" || !carTypes.includes(req.body.carType)){
        logger.info("car type is nether a string nor included in car Type");
        return res.sendStatus(400);
    }
    //9. Engine No and classis No
    if(typeof req.body.engineNo !="string" ||typeof req.body.classisNo !="string"){
        logger.info("car engine or classis no is not a string");
        return res.sendStatus(400);
    }

    //declare high scope variable
    let newPaper;
    let carSpecification;
    let dummyTTDK;
    let carOwn;
    let newDummyDK;
    //check if it existed in carSpec
    let carSpecCheck = await carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType}).exec();
    if(!carSpecCheck){
        logger.info("car specs isn't existed in db. Please re-check your information");
        return res.sendStatus(400);
    }
    //check if subdocument is ready (create subdocument)
    //1. Paper of recognition
    if(await paperOfRecognition.findOne({name: req.body.ownerName, licensePlate: req.body.licensePlate}).exec()){
        logger.info("This car has already recognized");
        return res.sendStatus(400);
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
                return res.sendStatus(400);
            });
    };
    //3. registrationn Information (link with dummy ttdk)
    dummyTTDK = await trungTamDangKiem.findOne({name: "dummy"}).exec();
    if(!dummyTTDK){
        logger.info("Can't find dummy TTDK, but system will create one...");
        let encodedPwd = await brcypt.hash("123456",10);
        dummyTTDK = new trungTamDangKiem({
            name: "dummy",
            user: "dummyUser",
            encodedPassword: encodedPwd,
            regionName: "dummy province",
            forgotPassword: false,
            refreshToken: ''
        });
        await dummyTTDK.save().then((doc)=>{
            logger.info("Create dummy ttdk successful");
        }).catch((err)=>{
            logger.info("something wrong when creating dummy model");
                return res.sendStatus(400);
        });
       
    };
    
    
    //4. car specification (must already have)
    carSpecification = await carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType}).exec();
    if(!carSpecification){
        logger.info("this car info isn't existed. Re-check the information");
        return res.sendStatus(400);
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
        logger.info("Add document"+paper+"successfully!");
    }
    ).catch((err)=>{
        logger.info("There is an error when creating new document to save to the model: "+err);
        return res.sendstatus(400);
    });

    //create dummy TTDK registration
    let eDate = new Date();
    eDate.setTime(aDate.getTime()+24*3600*1000); //1 day 
    let dkQua = Math.floor(aDate.getMonth()/3)+1;
    //Fixed bug Date
    newDummyDK = new registrationInformation({
        licensePlate: req.body.licensePlate,
        dateOfIssue: aDate,
        dateOfExpiry: eDate,
        quarter: dkQua,
        trungTamDangKiem: dummyTTDK._id,
        ownerName: req.body.ownerName,
        carType: req.body.carType,
        trungTamDangKiemName: "dummy",
        regionName: req.body.regionName
    });
    await newDummyDK.save().then((doc)=>{
        logger.info("Add temp registry successfully");
    }).catch((err)=>{
        logger.info("There is an error when creating temp registry");
        return res.sendStatus(400);
    });
    //Explain: dummyTTDK is just a name of variable, since it equal ttdk existed in DB, or new dummyTTDK

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
    })
    .catch((err)=>{
        logger.info("All information valid. Potential bug when creating car?");
        return res.sendStatus(400);
    });
    return res.json({"status":"success"}).status(200); 
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
*/
const createCarSpecification = async(req,res)=>{
    //check enough information
    if(!req?.body?.name || !req?.body?.version || !req?.body?.type){
        logger.info("Not enough information to create new car spec");
        return res.sendStatus(400);
    }
    //check valid
    if(!carTypes.includes(req.body.type)){
        logger.info("Car type not existed. Check your spelling");
        return res.sendStatus(400);
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
            return res.sendStatus(400);
        }       
    );
};

//function support node-fetch
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

//Upload cars from json (remember old pattern license plate)(not tested)
/*
Input: Array of objects:
+ organization: True|False
        + ownerName: (organization or personal)
        + licensePlate: 
        + dateOfIssue: Date() object
        + regionName:
        + carName: (e.g. Toyota)
        + carVersion (e.g. khong biet lol) - still a string
        + carType: xe tai hay xe con hay xe gi do 
        + engineNo: So may - string :))
        + classisNo: So khung - string :)))
        + historyRegistrationInformation: An array, each element contains:
            dateOfIssue:
            dateOfExpiry:
            trungTamDangKiemName:
            regionName:
            licensePlate: not required, use if old registration information using old license plate form.            

*/
const uploadCars = async(req,res)=>{
    if(!req?.body){
        logger.info("An error that body not existed");
        return res.sendStatus(400);
    }
    try{
        for(let i = 0 ; i< req.body.length; i++){
            //create car
            await result(req.body[i], SERVER_URL+ "/trungTamDangKiem/" + "god" + "/", "POST");
            var removeDummy = false;
            if(req.body[i].historyRegistrationInformation.length>0){
                for(let j = 0 ; j < req.body[i].historyRegistrationInformation.length ; j++){
                    await result(req.body[i].historyRegistrationInformation[j], SERVER_URL+ "/trungTamDangKiem/"+ "god" +"/newRegistry", "POST");
                    if(req.body[i].historyRegistrationInformation[j].dateOfExpiry> new Date().toISOString()){
                        removeDummy = true;
                    }
                }
            }
            //remove dummy registration information
            if(removeDummy){
                await registrationInformation.deleteOne({
                    licensePlate: req.body[i].licensePlate,
                    trungTamDangKiemName: "dummy"
                }).then((doc)=>{}).catch((err)=>{
                    logger.info("An error when deleting dummy when uploading cars");
                })
            }
            
        }
    }catch(err){
        logger.info("Err: "+err);
        return res.sendStatus(400);
    }
    return res.sendStatus(200);
    //check valid


};

//Export cars from json (not tested yet)
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
    let jsonData = await result(req.body,SERVER_URL+ "/trungTamDangKiem/god/carList","POST");
    //for each registration information, append licenseplate to a list
    let licensePlateList = []
    for(let i = 0 ; i< jsonData.length;i++){
        let tempObj = jsonData[i].toObject();
        licensePlateList.push(tempObj.licensePlate);
    }
    //filter to remove duplicate
    licensePlateList = [...new Set(licensePlateList)];
    //use fetch to search cars FOR EACH licenseplate
    var returnResult=[]
    for(let i = 0;i<licensePlateList.length;i++){
        let car = await result(licensePlateList[i],SERVER_URL+ "trungTamDangKiem/god/","POST");
        //convert to normal object, remove unnecessary ids
        car = car.toObject();
        car = car.status;
        delete car._id;
        delete car.paperOfRecognition._id;
        delete car.carOwner._id;
        delete car.registrationInformation._id;
        delete car.registrationInformation.trungTamDangKiem._id;
        delete car.carSpecification._id;
        for(let j = 0;j<car.historyRegistrationInformation.length; j++){
            delete car.historyRegistrationInformation[j]._id;
        }
        //append to result list
        returnResult.push(car);
    }
    //return
    res.json({"status": returnResult});
    return res.status(200);
    

};

//Delete car (not tested yet)
/*
Input: licensePlate of the car
Output: paperOfRecognition deleted, car deleted
But Registration information and car owner are kept (to track-able in the past if needed)
*/
const deleteCar = async(req,res)=>{
    //check contain
    if(!req?.body?.licensePlate){
        logger.info("No license plate provided");
        return res.sendStatus(400);
    }
    //check valid
    if(typeof req.body.licensePlate!="string"){
        logger.info("License plate is not a string");
    }
    //no check if match pattern or not, not necessary at all
    //transaction
    const session = await mongoose.connection.startSession();
    (await session).startTransaction();
    try{
        await paperOfRecognition.deleteOne({licensePlate: req.body.licensePlate}).then(()=>{logger.info("Delete successfully!")}).catch((err)=>{logger.info("An error when deleting paperOfRecognition")});
        await Cars.deleteOne({licensePlate: req.body.licensePlate}).then(()=>{logger.info("Delete successfully!")}).catch((err)=>{logger.info("An error when deleting paperOfRecognition")});

        await session.commitTransaction();
    }catch(err){
        logger.info("Error: "+ err);
        await session.abortTransaction();
    }
    await session.endSession();
    //return
    return res.json({"status":"success"}).status(200);
};

module.exports = {
    getCarsList,
    createCar,
    searchCar,
    createCarSpecification,
    deleteCar,
    uploadCars,
    exportCars
};



