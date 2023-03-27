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
    type: Date,
    required: true
  } 
});
module.exports = mongoose.model("PaperOfRecognition", paperOfRecognition);