const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const paperOfRecognition = new Schema({
  name: {
    type: String,
    required: true
  } ,
  licensePlate: {
    type: String,
    required: true
  } ,
  dateOfIssue: {
    type: Schema.Types.Date,
    required: true
  },
  //made so ez to track and query
  //TODO: automatically set the value when POST
  quarter: {
    type: Number,
    required: true
  },
  engineNo:{
    type: String,
    required: true
  },
  classisNo:{
      type: String,
      required: true
  }
});
module.exports = {
  "model": mongoose.model("PaperOfRecognition", paperOfRecognition),
"schema": paperOfRecognition};



