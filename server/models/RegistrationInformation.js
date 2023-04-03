const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const trungTamDangKiem = require('../models/TrungTamDangKiem');
const TrungTamDangKiem = require('../models/TrungTamDangKiem');
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
        type: TrungTamDangKiem,
        required:true
    }
});
module.exports = mongoose.model("RegistrationInformation", registrationInformation);