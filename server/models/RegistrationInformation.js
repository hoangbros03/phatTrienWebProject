const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    }
});
module.exports = mongoose.model("RegistrationInformation", registrationInformation);