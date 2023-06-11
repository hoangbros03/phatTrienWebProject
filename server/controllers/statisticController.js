const logger = require('../logger/logger');
const {"model": RegistrationInformation, RegistrationInformationSchema} = require("../models/RegistrationInformation");
const vitalFunc= require('../config/vitalFunction');
const carTypes = require('../config/carTypes');
const{"model": Car, CarSchema} = require('../models/Car');
const{"model": Region, RegionSchema} = require('../models/Region');
const{"model":Statistic, StatisticSchema} = require('../models/Statistic');
const { transpose } = require('matrix-transpose');

/*
GET API: statistic
statistic = {
    propotion: {
        data: [Number]
    },
    topProvinces: {
        provinces: [String],
        data: [Number]
    },
    quarter: {
        quarter: [String],
        data: [
            [Number],
            [Number],
            [Number],
            [Number],
            [Number]
        ]
    },
}

    
*/
const statistic = async(req,res)=>{
    console.log(req);
    //If day in record == current day => return entire info
    const contain = await Statistic.findOne({
        date: new Date().toISOString().substring(0,10)
    }).exec();
    if(contain && req?.params?.reCalc != "reCalc"){
        res.json(contain);
        return res.status(200);
    }
    //delete stat on current day
    await Statistic.deleteOne({
        date: new Date().toISOString().substring(0,10) 
    }).exec();
    // get all licensePlate in car
    var allCars = await Car.find().exec();
    allCars = Array.from(allCars);
    // find car with that licensePlate in regis info => take car type
    var propotion = [0,0,0,0,0,0];
    var province= [];
    var number =[];
    for(let i = 0; i< allCars.length; i++){
        if(!allCars[i].licensePlate){
            return ;
        }
        let regis = await RegistrationInformation.findOne({
            licensePlate: allCars[i].licensePlate
        }).exec();
        if(!regis || !regis.carType){
            return;
        }
        // count++
        propotion[carTypes.indexOf(regis.carType)]+=1;

        // check region name existed or not
        if(!allCars[i].regionName){
            return;
        }
        if(!province.includes(allCars[i].regionName)){
            province.push(allCars[i].regionName);
            number.push(0);
        }
        //count
        number[province.indexOf(allCars[i].regionName)]+=1;
    }
    
    //sort province and number
    let combined = province.map((value, index) => {
        return {a: value, b: number[index] };
      });
      
    // Sort the combined array based on the value of b
    combined.sort((x, y) => y.b - x.b);
    
    // Separate the sorted values back into separate arrays
    province = combined.map((value) => value.a);
    number = combined.map((value) => value.b);
    

    // hard code list of nearest quarters
    var quarter =[ "Q3 2021", "Q4 2021", "Q1 2022", "Q2 2022", "Q3 2022", "Q4 2022", "Q1 2023", "Q2 2023"];
    var quarterResult = [];
    // for each quarter, for each car type go get result from getCarList
    for(let i of quarter){
        let arrForEachQua = [];
        for(let j of carTypes){
            
            const [jsonResult, statusCode] = await vitalFunc.result({
                "type": "Đã đăng kiểm",
                "carType": j,
                "year": i.split(" ")[1],
                "quarter": i.split(" ")[0].substring(1,2),
                "month": "All",
                "province": "All",
                "ttdk": "All"
            },"/trungTamDangKiem/god/carList","POST",req?.headers?.authorization,false,true);
            
            if(statusCode=="200" && jsonResult instanceof Array){
                arrForEachQua.push(jsonResult.length);
            }else{
                arrForEachQua.push(0);
            }
        }
        quarterResult.push(arrForEachQua);
    }
   
    //  transpose
    quarterResult = transpose(quarterResult);
    console.log(quarterResult);
    // form to a schema like above, add date and store it
  
    const jsonResult = {
        "propotion": {
            "data": propotion
        },
        "topProvinces":{
            "province": province,
            "data": number
        },
        "quarter":{
            "quarter": quarter,
            "data": quarterResult
        },
        "date": new Date().toISOString().substring(0,10)
    };
    console.log(jsonResult);
    await Statistic.create(jsonResult).then((i)=>{
        logger.info("Create new statistic sucessfull!");
        res.json(jsonResult);
        
    }).catch((err)=>{
        logger.info("Err when get stat: "+err);
        res.json({"status": "Err when get stat"});
        return res.status(400);
    });
    return res.status(200);
    //return

};



module.exports = {statistic};