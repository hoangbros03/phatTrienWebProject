const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
This schema is made for validation purpose only. Do not use it as a subdocument of any other schemas
*/
const region = new Schema({
    regionName: {
        type: String,
        required: true
    },
    regionNumber: {
        type: Number,
        required: true,
        min: 10,
        max: 99
    }
});

//TODO: Create database of this schema for all provinces


module.exports ={"model": mongoose.model("region", region), "schema": region};