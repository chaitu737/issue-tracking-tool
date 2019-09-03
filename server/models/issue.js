 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    issueId:{type:String, unique:true, required:true},
    title:{
        type:String, required:true
    },  
    status:{
        type:String,default:'Backlog'
    },
    assignes:[],
    reporters:[],
    reporterId:{
        type:String,  default:'', required:true
    },
    Date:{
        type:Date, default:Date.now()
    },
    description:{
        type:String, required:true,default:'No description for the issue'
    },
    image:{
        type:String, required:true
    },
    comments:[],
    watcher:[]
    
});
issueSchema.index({'$**':'text'})

module.exports = mongoose.model('Issue', issueSchema);