const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carSpecification = new Schema({
    name:{
        type: String,
        required: true
    },
    version:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    producer: String,
    numberOfSeats: Number,
    width: Number,
    height: Number,
    power: Number
});
module.exports ={
    "model": mongoose.model("CarSpecification", carSpecification),
    "schema": carSpecification};