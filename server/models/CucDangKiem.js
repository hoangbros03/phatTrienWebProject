const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cucDangKiem = new Schema({
    user:{
        type: String,
        required: true
    },
    name: String,
    encodedPassword: {
        type:String,
        required: true
    },
    refreshToken: String


})
module.exports = {"model":mongoose.model('CucDangKiem', cucDangKiem),"schema": cucDangKiem};