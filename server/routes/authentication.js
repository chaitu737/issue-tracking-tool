const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('../models/user');
const {check,validationResult}= require('express-validator');
const Check = require('../libs/checklib');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const shortID= require('shortid');


module.exports = (router)=>{



    router.get('/allusers',(req,res)=>{
        User.find().exec((err,result)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!result){
                    res.json({success:false, message:'No users found'})
                }else{
                    res.json({success:true, result:result});
                }            }
        })
    });

    router.post('/register', [
          check('username').isAlphanumeric().isLength({min:1}).withMessage('Username is required'),
          check('email').isEmail().withMessage('Email is required'),
          check('password').isAlphanumeric().withMessage('Password is required')
        
    ],(req,res)=>{
        const errors=validationResult(req);
     if(!errors.isEmpty()){
         return res.status(422).json({errors:errors.array()})
     }
     let user = new User({
         userId:shortID.generate(),
         email: req.body.email,
         password:req.body.password,
         username:req.body.username

     });
     console.log(user); 
     user.save((err)=>{
         if(err){
             res.json({success: false, message:'Unable to save the user:',err})
         }else{
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'dummymail6674@gmail.com',
                  pass: 'santhu@51'
                }
              });

            var mailOptions = { 
                from: 'sahal737@gmail.com',
                to:  req.body.email,
                subject: 'Regarding Student Registration',
                text:  `Hello ${req.body.username}` ,
                html:`<h1>Welcome to Issue tracking tool` 
                
                 
               
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
                res.json({success:true, message:'Student Registered'})
         }
     });
    });

    router.post('/login',(req,res)=>{
        if(!req.body.username&&!req.body.email){
            res.json({success:false, message:'Username or Email id is required'})
        }else{
            if(!req.body.password){
                res.json({success:false, message:'Password is required'})
            }else{
                let username = req.body.username,
                
                    email = req.body.email;
                let conditions = (username.indexOf('@') === -1) ? {username: username} : {email: username};
                
                User.findOne(conditions,(err,user)=>{
                    if(err){
                        res.json({success:false, message:err})
                    }else{
                        if(!user){
                            res.json({success:false, message:'Username or Email is not Found'})
                        }else{
                            const validPassword = user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({success:false, message:'Password is invalid'})
                            }else{
                                  const token = jwt.sign({userId:user.userId, username:user.username}, config.secret,{expiresIn:'24h'});
                                  res.json({success:true, message:'Success!', token:token, user:{
                                      username:user.username,
                                      userId:user.userId
                                      
                                  }});
                            }
                        }
                    }
                })
            }
        }
        
    });


//  router.use((req, res, next) => {
//     const token = req.headers['authorization']; // Create token found in headers
//     // Check if token was found in headers
//     if (!token) {
//       res.json({ success: false, message: 'No token provided' }); // Return error
//     } else {
//       // Verify the token is valid
//       jwt.verify(token, config.secret, (err, decoded) => {
//         // Check if error is expired or invalid
//         if (err) {
//           res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
//         } else {
//           req.decoded = decoded; // Create global variable to use in any request beyond
//           next(); // Exit middleware
//         }
//       });
//     }
//   });


router.post('/forget-password',(req,res)=>{
    if(!req.body.email){
        res.json({success:false, message:'Email is required'})
    }else{
        User.findOne({email:req.body.email}).select('userId username').exec((err, user)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!user){
                    res.json({success:false, message:'No user with given Email kindly register'})
                }else{
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'dummymail6674@gmail.com',
                          pass: 'santhu@51'
                        }
                      });
        
                    var mailOptions = { 
                        from: 'sahal737@gmail.com',
                        to:  req.body.email,
                        subject: 'Regarding Student Registration',
                        text:  `Hello ${user.username}` ,
                        html:`You recently requested for the password change
                          <p>Please click <a href ="http://localhost:4200/change-password/${user.userId}"`
                        
                         
                       
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                      res.json({success:true, message:'An email is send to change the password'})
                }
            }
        })
    }
  
});
router.put('/change-password',(req,res)=>{
    if(!req.body.password){
        res.json({success:false, message:'Password is required'})
    }else{
        User.findOne({userId:req.body.userId},(err, user)=>{
            
            if(err){
                res.json({success:false, message:err})
            }else{
                if(!user){
                    res.json({success:false, message:'No user Please Register'})
                }else{
                    user.password = req.body.password;
                    user.save((err)=>{
                        if(err){
                            res.json({success:false, message:err})
                        }else{
                            res.json({success:true,message:'Password is changed'})
                        }
                    })
                }
            }
        })
    }
//  if(!req.body.password){
//      res.json({success:false, message:'Password is required'})
//  }else{
//      if(!req.body.userId){
//          res.json({success:false, message:'User is not registered'})
//      }else{
//          User.findOneAndUpdate({userId:req.body.userId},(err, user)=>{
//              console.log(user);
//              if(err){
//                  res.json({success:false, message:err});
//              }else{
//                  if(!user){
//                      res.json({success:false, message:'No user is not registered'})
//                  }
//                  user.password = req.body.password;
//                  user.save((err)=>{
//                      if(err){
//                          res.json({success:false, message:'Unable to save the password please try again'})
//                      }else{
//                          res.json({success:true, message:'Password changed Successfully'})
//                      }
//                  })
//              }
//          });
//      }
//  }
});



router.post('/social',(req,res)=>{
    if(!req.body.email){
        res.json({success:false, message:'Email is required'})
    }else{
        User.findOne({email:req.body.email},(err, result)=>{
            if(err){
                res.json({success:false, message:err})
            }else{
                if(Check.isEmpty(result)){
                    let user = new User({
                        userId:shortID.generate(),
                        email: req.body.email,
                         
                        username:req.body.username
               
                    });
                    user.save((err)=>{
                        if(err){
                            res.json({success: false, message:'Unable to save the user:',err})
                        }else{
                           var transporter = nodemailer.createTransport({
                               service: 'gmail',
                               auth: {
                                 user: 'dummymail6674@gmail.com',
                                 pass: 'santhu@51'
                               }
                             });
               
                           var mailOptions = { 
                               from: 'sahal737@gmail.com',
                               to:  req.body.email,
                               subject: 'Regarding Student Registration',
                               text:  `Hello ${req.body.username}` ,
                               html:`<h1>Welcome to Issue tracking tool` 
                               
                                
                              
                             };
                             
                             transporter.sendMail(mailOptions, function(error, info){
                               if (error) {
                                 console.log(error);
                               } else {
                                 console.log('Email sent: ' + info.response);
                               }
                             });
                               res.json({success:true, message:'Student Registered'})
                        }
                    });


                }else{
                    console.log(result);
                    const token = jwt.sign({userId:result.userId, username:result.username}, config.secret,{expiresIn:'24h'});

                    // res.json({success:true, result:result})
                    res.json({success:true, message:'Success!', token:token, user:{
                        username:result.username,
                        userId:result.userId
                        
                    }});
                
                }
            }
        })
     }
});


// router.post('/sociallogin',(req,res)=>{
//     if(!req.body.email){
//         res.json({success:false, message:'Enter email to login'})
//     }else{
//         User.findOne({email:req.body.email},(err, result)=>{
//             if(err){
//                 res.json({success:false, message:err})
//             }else{
//                 if(!result){
//                     res.json({success:false, message:'No user with given credentials'})
//                 }else{}
//             }
//         })
//     }
// })


router.post('/logout',(req,res)=>{
     if(!req.body.userId){
         res.json({success:false, message:'UserId is required'})
     }else {
         User.findOneAndRemove({userId:req.body.userId},(err, result)=>{
             console.log(req.body.userId);
             if(err){
                 res.json({success:false, message:err})
             }else{
                 if(!result){
                     res.json({success:false, message:'No user found'})
                 }
                 res.json({success:true, message:'Loggedout Successfully'})
             }
         })
     }
});




    return router;
}