const logger = require('../logger/logger');
const {"model": RegistrationInformation, RegistrationInformationSchema} = require("../models/RegistrationInformation");
const vitalFunc= require('../config/vitalFunction');
const carTypes = require('../config/carTypes');
const{"model": Car, CarSchema} = require('../models/Car');
const{"model": Region, RegionSchema} = require('../models/Region');
const{"model":Statistic, StatisticSchema} = require('../models/Statistic');
const {"model": TrungTamDangKiem, TrungTamDangKiemSchema} = require('../models/TrungTamDangKiem');
const { transpose } = require('matrix-transpose');
const ss = require('simple-statistics');
const carsController = require('../controllers/carsController');


//TODO: Predict
// Dự báo số lượng xe sẽ đăng kiểm mới và đăng kiểm lại hàng tháng ở từng trung tâm đăng kiểm, khu vực, hay trên toàn quốc.
//type: Đăng kiểm mới/ đăng kiểm lại
//ttdk: All/ Tên ttam
//regionName: All/ Tên kvuc
//monthsBased : Number, not required, default =5 , 3<= x <= 24
//monthsPredcit: Number, not required, default = 2, 1<=x<=6
const predict = async(req,res)=>{
    //check enough
    if(!req?.body?.type || !req?.body?.ttdk || !req?.body?.regionName){
        logger.info("Not enough info!");
        return res.status(400).json({"status":"Not enough info!"});
    }
    //check valid
    if(typeof req.body.type != "string" || typeof req.body.ttdk !="string" || typeof req.body.regionName !="string"){
        logger.info("Type of requried infos not the string (at least one of them)");
        return res.status(400).json({"status":"Type of requried infos not the string (at least one of them)"});
    }
    
    if(req.body.type.toLowerCase()!="đăng kiểm mới" && req.body.type.toLowerCase()!="đăng kiểm lại"){
        logger.info("Danng kiem moi or dang kiem lai only, don't pass any other string!");
        return res.status(400).json({"status": "Danng kiem moi or dang kiem lai only, don't pass any other string!"});
    }
    if(req.body.regionName.toLowerCase()=="all"){
        if(req.body.ttdk.toLowerCase()!="all"){
            logger.info("Region name is all, but ttdk is not all. WTf?");
            return res.status(400).json({"status": "Region name is all, but ttdk is not all. WTf?"});
        }
    }else{
        if(req.body.ttdk.toLowerCase()!="all"){
            const validTtdk = await TrungTamDangKiem.findOne({
                regionName: vitalFunc.toTitleCase(req.body.regionName),
                name: req.body.ttdk
            }).exec();
            if(!validTtdk){
                logger.info("Can't find ttdk within the specified region name, check the spelling might help.");
                return res.status(400).json({"status": "Can't find ttdk within the specified region name, check the spelling might help."});
            }
        }
    }
    //correctness
    req.body.regionName= vitalFunc.toTitleCase(req.body.regionName);
    var monthsBased = 5;
    var monthsPredict =2
    if(req.body.monthsBased){
        if(typeof req.body.monthsBased != "number"){
            logger.info("Month based provided, but not a number");
            return res.status(400).json({"status": "Month based provided, but not a number"});
        }
        if(req.body.monthsBased<3 || req.body.monthsBased>24){
            logger.info("min 3, max 24 for month based!");
            return res.status(400).json({"status": "min 3, max 24 for month based!"});
        }
        monthsBased = req.body.monthsBased;
    }
    if(req.body.monthsPredict){
        if(typeof req.body.monthsPredict != "number"){
            logger.info("Month Predict provided, but not a number");
            return res.status(400).json({"status": "Month Predict provided, but not a number"});
        }
        if(req.body.monthsPredict<1 || req.body.monthsPredict>6){
            logger.info("min 1, max 6 for month Predict!");
            return res.status(400).json({"status": "min 1, max 6 for month Predict!"});
        }
        monthsPredict = req.body.monthsPredict;
    }
    //do part
    const currentDate = new Date();
    var pastMonths= [];
    if(req.body.type.toLowerCase()=="đăng kiểm mới"){
        for(let i = 1 ; i<= monthsBased; i++){
            let tempDate =new Date(currentDate.setMonth(currentDate.getMonth() - i));
            //Remember to convert date info to string
            let cars = await RegistrationInformation.find({
                $expr: {$and:[{
                        $regexMatch: {
                            input: { $toString: {$month: "$dateOfIssue"} },
                            regex: carsController.correct((tempDate.getMonth()+1).toString())
                          }
                    },{
                        $regexMatch: {
                            input: { $toString: {$year: "$dateOfIssue"} },
                            regex: carsController.correct((tempDate.getFullYear()).toString())
                          }
                    },{
                        $regexMatch:{
                            input: "$regionName",
                            regex: carsController.correct(req.body.regionName)
                        }
                    },{
                        $regexMatch:{
                            input: "$trungTamDangKiemName",
                            regex: carsController.correct(req.body.ttdk)
                        }
                    }]}
            ,firstTime: true
            }).exec();
            pastMonths.splice(0,0,[monthsBased-i,cars.length]);
        }
    }else if(req.body.type.toLowerCase()=="đăng kiểm lại"){
        for(let i = 1 ; i<= monthsBased; i++){
            let tempDate =new Date(currentDate.setMonth(currentDate.getMonth() - i));
            //Remember to convert date info to string

            let cars = await RegistrationInformation.find({
                $expr: {$and:[{
                    $regexMatch: {
                        input: { $toString: {$month: "$dateOfIssue"} },
                        regex: carsController.correct((tempDate.getMonth()+1).toString())
                      }
                },{
                    $regexMatch: {
                        input: { $toString: {$year: "$dateOfIssue"} },
                        regex: carsController.correct((tempDate.getFullYear()).toString())
                      }
                },{
                    $regexMatch:{
                        input: "$regionName",
                        regex: carsController.correct(req.body.regionName)
                    }
                },{
                    $regexMatch:{
                        input: "$trungTamDangKiemName",
                        regex: carsController.correct(req.body.ttdk)
                    }
                }]}
            }).exec();
            pastMonths.splice(0,0,[monthsBased-i,cars.length]);
        }
    }else{
        logger.info("Shouldn't get here!");
        return res.status(400).json({"status":"Code goes to bug place. Please let me know to fix it"});
    }
    //past to linear regression and get number
    console.log(pastMonths);
    var l = ss.linearRegressionLine(ss.linearRegression(pastMonths));
    //add
    var resultArr = [];
    for(let i = 0; i< monthsPredict;i++){
        resultArr.push([i,Number.parseInt(l(pastMonths.length+i))]);
    };
    return res.status(200).json({"status":resultArr});
};

module.exports = {predict};