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
    quarter:{
        type: Number,
        requried: true
    },

    trungTamDangKiem:{  
        type: Schema.Types.ObjectId,
        ref: "TrungTamDangKiem",
        required:true
    },
    ownerName:{
        type: String,
        required:true
    },
    carType:{
        type: String,
        required: true
    },
    trungTamDangKiemName:{
        type: String,
        required:true
    },
    regionName:{
        type: String,
        required: true
    }

});
module.exports = {"model": mongoose.model("RegistrationInformation", registrationInformation),
"schema": registrationInformation};