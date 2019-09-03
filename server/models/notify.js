const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const notifySchema = new Schema({
     notifyId:{
         type:String, unique:true, required:true
     },
     senderName:{
         type:String,default:''
     },
     senderId:{
         type:String
     },
     receiverId:{
         type:String
     },
     receiverName:{
         type:String
     },
     message:{
         type:String
     },
     issueId:{
         type:String
     },
     createdOn:{
         type:Date,default:Date.now
     }
 });
 module.exports =mongoose.model('Notify', notifySchema)
