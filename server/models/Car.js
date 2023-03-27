const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const carOwner = require('./CarOwner');
const carSpecs = require('./CarSpecification');
const paperOfReg = require('./PaperOfRecognition');
const regisInfor = require('./RegistrationInformation');

const car = new Schema({
    paperOfRecognition: {
        type: paperOfReg,
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
        type: carOwner,
        required: true
    },
    registrationInformation:{
        type: regisInfor,
        required: true
    }


});
module.exports = mongoose.model("Car",car);