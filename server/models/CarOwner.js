const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carOwner = new Schema({
    organization : {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    regionName: {
        type: String,
        required: true
    },address : String,
    ID: {
        type: String,
        minLength: 9,
        maxLength: 12
    }

});
module.exports ={"model": mongoose.model("CarOwner", carOwner), "schema": carOwner};