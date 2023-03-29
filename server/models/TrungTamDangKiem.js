const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const trungTamDangKiem = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type:String,
        required:true
    },
    encodedPassword: {
        type: String,
        required: true
    },
    regionName: {
        type: String,
        required: true
    },
    forgotPassword: Boolean,
    refreshToken : String
});
module.exports = mongoose.model('TrungTamDangKiem', trungTamDangKiem);