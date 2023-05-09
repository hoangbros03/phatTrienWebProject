const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
statistic = {
    propotion: {
        data: [Number]
    },
    topProvinces: {
        provinces: [String],
        data: [Number]
    },
    quarter: {
        quarter: [String],
        data: [
            [Number],
            [Number],
            [Number],
            [Number],
            [Number]
        ]
    },
}
Currently working
*/
const statistic = new Schema({
    date: {
        type: String,
        require:true
    },
    propotion:{
        type :{data:[{type:Number}]},
        required: true
    },
    topProvinces:{
        type: {
            province: [{type:String}],
            data: [{type:Number}]
        },
        required: true
    },
    quarter: {
        type:{
            quarter: [{type:String}],
            data: [
                [{type:Number}]
            ]
        },
        required: true
        
    }
});

module.exports = {"model": mongoose.model("Statistic", statistic), "schema": statistic};