const shortId = require('shortid');
const Issue = require('../models/issue');
const fs = require('fs');
const check = require('../libs/checklib');
const multer = require('multer');
// const upload= multer({dest:'uploads/'});

const storage = multer.diskStorage({
    destination: function(req,image,cb){
      cb(null,'./uploads/');
    },
    filename: function(req,image,cb){
      cb(null,new Date().toISOString().replace(/[\/\\:]/g, "_") + image.originalname);
    }
  });

  const fileFilter = (req, image,cb)=>{
    if(image.mimetype ==='image/jpeg'|| image.mimetype ==='image/png'){
      cb(null, true);
    }else{   
    cb(null, false);
    }
  
  }
  const upload = multer({storage: storage, limits:{
    fileSize: 1024*1024*5
  },
  fileFilter:fileFilter
  });


module.exports = (router)=>{
router.get('/allissues',(req,res)=>{
 Issue.find({},(err, issue)=>{
     if(err){
         
        res.json({success:false, message:err});
     }else{
         if(!issue){
             res.json({success:false, message:'No issues to be displayed'})
         }else{
             res.json({success:true, issue:issue})
         }
     }
 }).sort({'_id':-1})
});
router.get('/issue/:id',(req,res)=>{
        if(!req.params.id){
            res.json({success:false, message:'Id is required'});
        }else{
            Issue.findOne({issueId:req.params.id}, (err, issue)=>{
                if(err){
                    res.json({success:false, message:'No issue found with given id'})
                }
                res.json({success:true, issue:issue});
            })
        }
});
router.post('/createissue',upload.single('image'),(req,res)=>{
     let assigeArray =JSON.parse(req.body.assigne),
    
    
    newIssue= new Issue({
        issueId:shortId.generate(),
        title:req.body.title,
         status:req.body.status,
        description:req.body.description,
        reporterId:req.body.reporterId, 
        assignes:assigeArray,
        image:req.file.filename

         
    })
    
    
    newIssue.save((err)=>{ 
        if(err){
            res.json({success:false, message:err});
        }else{
            res.json({success:true, message:'Issue created successfully'})
        }
    })

});

router.get('/search',(req,res)=>{
    if(!req.query.description){
        res.json({success:false, message:'No text is entered'})
    }else{
    
        // regex= new RegExp(text);
        Issue.find({$text: { $search: req.query.description }}).limit(10).exec((err, result)=>{
            if(err){
                res.json({success:false, message:err})
            }else{
                if(check.isEmpty(result)){
                    res.json({success:false, message:'No issues found'})
                }else{
                    res.json({success:true, result:result})
                }
            }
        });
    }
    // if(!req.params){
    
    //     res.json({success:false, message:'No text entered'})
    //  }else{
    //      console.log(req.params);
    //       let text = req.query;
    //       console.log(text);  
    //       regex = new RegExp(text);
    //       console.log(regex);
    //       Issue.find({"description":regex}).exec((err, result)=>{
    //           if(err){
    //               res.json({success:false, message:err})
    //           }else{
    //               if(!result){
    //                   res.json({success:false, message:"No issues found"})
    //               }else{
    //                   res.json({success:true, result:result
    //                 })
    //               }
    //           }
    //       });
    //}
    // if(!req.params){
    //     res.json({success:false, message:'NO text entered to search'})
    // }else{
    //     let text = req.query
    //     regex = new RegExp(text);
    //     Issue.find({text:req.query}).exec((err, issue)=>{
    //         if(!issue){
    //             res.json({success:false, message:'No issues found'})
    //         }else{
    //             res.json({success:true, issue:issue})
    //         }
    //     })
    // }
});

router.put('/updateissue', upload.single('image'), (req,res)=>{
    if(!req.body.issueId){
        res.json({success:false, message:'No issueId is provided'})
    }else{
        Issue.findOne({issueId:req.body.issueId},(err, issue)=>{
            if(err){
                res.json({success:false, message:err})
            }else{
                if(issue){
                    if(req.file){
                        fs.unlinkSync('./uploads/'+ req.body.image1);
                        let m = req.body
                        let assigeArray = JSON.parse(req.body.assignee)

                        m.image = req.file.filename;
                        issue.title = req.body.title
                        issue.status = req.body.status
                        issue.description = req.body.description
                        issue.assignes = assigeArray
                        issue.image = req.file.filename
                        console.log(issue)
                        issue.save((err)=>{
                            if(err){
                                res.json({success:false, message:err})
                            }else{
                                res.json({success:true, message:'issue updated successfully'})
                            }
                        })
                    }else{
                        let assigeArray = JSON.parse(req.body.assignee)
                        issue.title = req.body.title
                        issue.description = req.body.description
                        issue.status = req.body.status
                        issue.assignes = assigeArray
                        issue.save((err)=>{
                            if(err){
                                res.json({success:false, message:err})
                            }else{
                                res.json({success:true, message:'Issue updated successfully'})
                            }
                        })
                    }
                }

            }
        } )
    }
    
    
});


router.put('/comment',(req,res)=>{


    if(!req.body.comments){
        res.json({success:false, message:'Comment should not empty'})
    }else{
        if(!req.body.issueId){ 
            res.json({success:false, message:'No issue id  foun'})
        }else{
            Issue.findOne({issueId:req.body.issueId},(err,issue)=>{
    
                if(err){
                
                    res.json({success:false, message:err})
                }else{
                    if(!issue){
                        res.json({success:false, message:'No issue found'})
                    }else{
                        
                        let commentArray = req.body
                        console.log(commentArray);
                        
                    
                        issue.comments.push(commentArray);
                    
            
                        issue.save((err)=>{
                            if(err){
                                res.json({success:false, message:err})
                            }else{
                                res.json({success:true, message:'issue saved successfully'})
                            }
                            })
                    
                    
                    }
                }
            })
        }

    }
});

router.post('/watcher',(req,res)=>{
    

    if(!req.body.issueId){
        res.json({success:false, message:'No issue to watch'})
    }else{
        Issue.findOne({issueId:req.body.issueId},(err,issue)=>{
            if(err){
                res.json({success:false, message:err})  
            }else{
                if(!issue){
                    res.json({success:false, message:'no issue with given id'})
                }else{
                    let watcherArray = req.body;
                
                    issue.watcher.push(watcherArray);
                    issue.save((err)=>{
                        if(err){
                            res.json({success:false, message:err})
                        }else{
                            res.json({success:true, message:'Added watcher successfully'})
                        }
                    })
                }
            }
        });
    }
});

router.post('/assigne',(req,res)=>{
    

    if(!req.body.issueId){
        res.json({success:false, message:'No issue to watch'})
    }else{
        Issue.findOne({issueId:req.body.issueId},(err,issue)=>{
            if(err){
                res.json({success:false, message:err})  
            }else{
                if(!issue){
                    res.json({success:false, message:'no issue with given id'})
                }else{
                    let assigneArray = JSON.parse(req.body.assigneArray);
                
                    issue.assignes =(assigneArray);
                    issue.save((err)=>{
                        if(err){
                            res.json({success:false, message:err})
                        }else{
                            res.json({success:true, message:'Added Assignes successfully'})
                        }
                    })
                }
            }
        });
    }
});






    return router;
}