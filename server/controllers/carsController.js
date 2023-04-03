const Cars = require('../models/Car');
const logger = require('../logger/logger');
/*
CAR LIST PART
*/

//month, province, quarter, ttdk, type, year, incoming carType

//get car based on condition
//This is used so if 'all', we can query regardless of the value of key(s)
const correct = (i)=>{
    if(i!="all") return i;
    return /./;
}
//correctMonth, since the Month in js is bullshit
const correctMonth = (i) =>{
    i = Number(i);
    if(i=='NaN')return /./;
    return i-1;
    
}

const enoughInformation = (r)=>{
    if(!r?.province || !r?.month || !r?.quarter || !r?.ttdk || !r?.type || !r?.year || !r?.carType){
        logger.info('Not enough information for querying!');
        return false;
    }
    return true;
}
const getCarsList = async(req,res)=>{
    if(!enoughInformation(req)){return res.status(400).json({"message":"Please give back-end enough information"});}
    let cars;
    if(req.type=='registered'){
        cars=await Cars.find({
            regionName: correct(req.province),
            $expr : {$and :[
                {$eq:[{$month: '$paperOfRecognition.dateOfIssue'}, correctMonth(req.month)]},
                {$eq:['$paperOfRecognition.quarter',correct(req.quarter)]},
                {$eq:['$registrationInformation.trungTamDangKiem.name',correct(req.ttdk)]},
                {$eq:[{$year: '$paperOfRecognition.dateOfIssue'},correct(req.year)]},
                {$eq:['$carSpecification.type',correct(req.carType)]}
            ]
        }
        });

    }else if(req.type==='nearExpire'){
        //in less than or equal to 3 month

        const expireDate = new Date();
        expireDate = expireDate.setTime(expireDate.getTime()+(3 * 30 * 24 * 60 * 60 * 1000)); //3 month later
        cars = await Cars.find({
            regionName: correct(req.province),
            $expr:{
                $and:[
                    {$eq:['$registrationInformation.trungTamDangKiem.name',correct(req.ttdk)]},
                    {$eq:['$carSpecification.type',correct(req.carType)]},
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


//create car

//update car

//delete car


//statistic part later if have time