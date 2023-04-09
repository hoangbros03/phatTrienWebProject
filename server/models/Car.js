const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {carownermodel, carOwner }= require('./CarOwner');
const {carspecmodel, carSpecs }= require('./CarSpecification');
const {paperrecogmodel, paperOfReg} = require('./PaperOfRecognition');
const {reginfomodel, regisInfor} = require('./RegistrationInformation');

const car = new Schema({
    paperOfRecognition: {
        type: mongoose.SchemaTypes.ObjectId,
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
        required: true
    },
    registrationInformation:{
        type: Schema.Types.ObjectId,
        required: true
    },
    carSpecification:{
        type:Schema.Types.ObjectId,
        required:true
    },
    engineNo:{
        type: Schema.Types.ObjectId,
        required: true
    },
    classisNo:{
        type: Schema.Types.ObjectId,
        required: true
    }


});
module.exports = mongoose.model("Car",car);