const {Cars,CarsSchema} = require('../models/Car');
const logger = require('../logger/logger');
const {Region,RegionSchema} = require('../models/Region');
const {carTypes, carTypesSchema} = require('../config/carTypes');
const {carSpecs, carSpecsSchema} = require('../models/CarSpecification');
const {paperOfRecognition, paperOfRecognitionSchema} = require('../models/PaperOfRecognition');
const {carOwner,carOwnerSchema} = require('../models/CarOwner');
const {trungTamDangKiem, trungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const brcypt = require('bcrypt');
const {CarSpecification, CarSpecificationSchema} = require('../models/CarSpecification');
/*
CAR LIST PART
*/


//This is used so if 'all', we can query regardless of the value of key(s)
const correct = (i)=>{
    if(i!="all") return i;
    return /./;
}
//correctMonth, since the Month in js is bullshit
const correctMonth = (i) =>{
    i = Number(i);
    if(isNaN(i))return /./;
    return i-1;
    
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
//month, province, quarter, ttdk, type, year, incoming carType

//get car based on condition
const getCarsList = async(req,res)=>{
    if(!enoughInformationToGetList(req)){return res.status(400).json({"message":"Please give back-end enough information"});}
    let cars;
    if(req.body.type=='registered'){
        cars=await Cars.find({
            regionName: correct(req.body.province),
            $expr : {$and :[
                {$eq:[{$month: '$paperOfRecognition.dateOfIssue'}, correctMonth(req.body.month)]},
                {$eq:['$paperOfRecognition.quarter',correct(req.body.quarter)]},
                {$eq:['$registrationInformation.trungTamDangKiem.name',correct(req.body.ttdk)]},
                {$eq:[{$year: '$paperOfRecognition.dateOfIssue'},correct(req.body.year)]},
                {$eq:['$carSpecification.type',correct(req.body.carType)]}
            ]
        }
        });

    }else if(req.body.type==='nearExpire'){
        //in less than or equal to 3 month

        const expireDate = new Date();
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
        });



    }else{
        //TODO: Predict
        
    }

    //return part
    if(!cars){
        res.json({"message":"No car found."});
        return res.status(204);
    }
    res.json(cars);

};

//search car
const searchCar = async(req,res)=>{
    //check search length
    if(!req?.body?.searchValue){
        logger.info("Not found searchValue");
        res.sendStatus(400);
    }else if(req.body.searchValue.length!=10){
        logger.info("Too short to find!");
        res.sendStatus(400);
        //TODO: IN UPDATING PROGRESS
    }
    //process the search
    let value;
    if(req.body.searchValue.length == 10) value= req.body.searchValue;
    else if(req.body.searchValue.length<10){
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
    const car = Cars.find({
        licensePlate: value
    });
    //return
    if(!car){
        logger.info("No car match the search");
        return res.sendStatus(200);
    }
    return res.json(car);
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
    if(!req?.body?.organization || !req?.body?.ownerName || !req?.body?.licensePlate || !req?.body?.dateOfIssue || !req?.body?.regionName || !req?.body?.carName || !req?.body?.carVersion || !req?.body?.carType ||!req?.body?.engineNo || !req?.body?.classisNo){
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
    if(typeof req.body.licensePlate !="string" ||!req.body.licensePlate.match(/\d{2}[A-Z]-\d{3}.\d{2}/)){
        logger.info("the licensePlate is either not a string or not a proper syntax. Please check again");
        return res.sendStatus(400);
    }
    //get 2 first number and check if it is valid
    let regionNumber = Number(req.body.licensePlate.substring(0,2));
    if(isNa(regionNumber)){ //actually can't happen
        logger.info('the licensePlate is either not a string or not a proper syntax. Please check again');
        return res.sendStatus(400);
    }
    //4. dateOfIssue
    if(!req.body.dateOfIssue instanceof Date){
        logger.info("dateOfIssue not a Date object. Tk hung m check lai xem");
        return res.sendStatus(400);
    }
    //5. regionName
    if(typeof req.body.regionName != "string"){
        logger.info("region Name is not a string. Please check again");
        return res.sendStatus(400);
    }
    
    const checkRegion = Region.findOne({regionName: req.body.regionName, regionNumber: regionNumber});
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
    

    //check if it existed in carSpec
    let carSpecCheck = carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType});
    if(!carSpecCheck){
        logger.info("car specs isn't existed in db. Please re-check your information");
        return res.sendStatus(400);
    }
    //check if subdocument is ready (create subdocument)
    //1. Paper of recognition
    if(paperOfRecognition.findOne({name: req.body.ownerName, licensePlate: req.body.licensePlate})){
        logger.info("This car has already recognized");
        return res.sendStatus(400);
    }else{
        //get quarter
        let qua = req.body.dateOfIssue.getMonth()%3 +1;
        //create new documnent
        const newPaper = new paperOfRecognition({
            name: req.body.ownerName,
            licensePlate: req.body.licensePlate,
            dateOfIssue: req.body.dateOfIssue,
            quarter: qua,
            engineNo: req.body.engineNo,
            classisNo: req.body.classisNo
        });
        //save
        await newPaper.save((err, paper)=>{
            if (err){
                logger.info("There is an error when creating new document to save to the model: "+err);
                return res.sendstatus(400);
            }
            logger.info("Add document"+paper+"successfully!");
        });
        
    }
    //2. Car owner
    let carOwn = carOwner.findOne({organization: req.body.organization, name: req.body.ownerName, regionName: req.body.regionName});
    if(!carOwn){
        let address = "", ID= "";
        if(req.body.address) address = req.body.adress;
        if(req.body.ID) ID = req.body.ID;
        carOwn = new carOwner({
            organization: req.body.organization,
            name: req.body.ownerName,
            regionName: req.body.regionName,
            adress: adress,
            ID: ID
        });
        await carOwn.save((err,doc)=>{
            if(err){
                logger.info("error when creating newOwner");
                return res.sendStatus(400);
            };
            logger.info("Create successful car owner for: " + doc);
        });
    };
    //3. registrationn Information (link with dummy ttdk)
    let dummyTTDK = trungTamDangKiem.findOne({name: "dummy"});
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
        await dummyTTDK.save((err,doc)=>{
            if(err){
                logger.info("something wrong when creating dummy model");
                return res.sendStatus(400);
            }
            logger.info("Create dummy ttdk successful");
        });
    };
    //4. car specification (must already have)
    const carSpecification = carSpecs.findOne({name: req.body.carName, version: req.body.carVersion, type: req.body.carType});
    if(!carSpecification){
        logger.info("this car info isn't existed. Re-check the information");
        return res.sendStatus(400);
    }
    //create mongoose   
    const newCar = new Cars({
        paperOfRecognition: newPaper,
        licensePlate: req.body.licensePlate,
        regionName: req.body.regionName,
        producer: carSpecification.producer,
        version: carSpecification.version,
        carOwner: carOwn,
        registrationInformation: dummyTTDK,
        carSpecification: carSpecification,
        engineNo: req.body.engineNo,
        classisNo: req.body.classisNo
    });
    //notify
    const result = await newCar.save((err,doc)=>{
        if(err){
            logger.info("All information valid. Potential bug when creating car?");
            return res.sendStatus(400);
        }
        logger.info("New car created: "+doc);
    });
    res.json({"status":"complete", result}); //TODO: Check response json
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
    const result = await newCarSpec.save((err,doc)=>{
        if(err){
            logger.info("Something wrong when creating newCarSpec: "+err);
            return res.sendStatus(400);
        }
        logger.info("Create newCarSpec successfully");
        res.json({"status":"success",doc});
        //TODO: Check how should API response back
    });
};




//update car 


//delete car

module.exports = {
    getCarsList,
    createCar,
    searchCar
};



