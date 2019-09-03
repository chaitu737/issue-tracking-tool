const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');   



let verifyToken = (token,cb)=>{
    
    jwt.verify(token, config.secret,(err, decoded)=>{
        if(err){
            console.log('Error while verifying token');
            console.log(err);
          
            cb(err,null)
        }
    else{
        console.log('User verified');
        cb(null, decoded)
    }
    });
}

module.exports = {
    verifyToken:verifyToken
}