const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {TrungTamDangKiemModel, TrungTamDangKiem} = require('../models/TrungTamDangKiem');
const registrationInformation = new Schema({
    licensePlate: {
        type: String,
        required: true
    },
    dateOfIssue: {
        type: Date,
        required: true
    },
    dateOfExpiry: {
        type: Date,
        required: true
    },
    trungTamDangKiem:{  
        type: Schema.Types.ObjectId,
        required:true
    }

});
module.exports = {"model": mongoose.model("RegistrationInformation", registrationInformation),
"schema": registrationInformation};