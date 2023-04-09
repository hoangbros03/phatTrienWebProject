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
    ID: String

});
module.exports ={"model": mongoose.model("CarOwner", carOwner), "schema": carOwner};