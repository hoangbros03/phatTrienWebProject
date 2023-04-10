const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {carownermodel, carOwner }= require('./CarOwner');
const {carspecmodel, carSpecs }= require('./CarSpecification');
const {paperrecogmodel, paperOfReg} = require('./PaperOfRecognition');
const {reginfomodel, regisInfor} = require('./RegistrationInformation');

const car = new Schema({
    paperOfRecognition: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "PaperOfRecognition",
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },
    regionName: {
        type: String,
        required: true
    },
    producer: String,
    version: String,
    carOwner:{
        type: Schema.Types.ObjectId,
        ref : "CarOwner",
        required: true
    },
    registrationInformation:{
        type: Schema.Types.ObjectId,
        ref: "RegistrationInformation",
        required: true
    },
    carSpecification:{
        type:Schema.Types.ObjectId,
        ref: "CarSpecification",
        required:true
    },
    engineNo:{
        type: String,
        required: true
    },
    classisNo:{
        type: String,
        required: true
    }


});
module.exports = {"model": mongoose.model("Car",car),
"schema": car}