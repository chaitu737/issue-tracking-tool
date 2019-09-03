const shortId = require('shortid');
const Issue = require('../models/issue');
const Notify = require('../models/notify');


module.exports = (router)=>{
    router.get('/notify/:id',(req,res)=>{
        if(!req.params.id){
            res.json({success:false, message:'Id is required'})
        }else{
            Notify.find({receiverId:req.params.id},(err, result)=>{
                console.log(req.params.id);
                if(err){
                    res.json({success:false, message:err})
                }else{
                    if(!result){
                        res.json({success:false, message:'No notificatios found'})
                    }
                    res.json({success:true, result:result});
            

                }

            })
        }
    //     if(!req.params.id){
    //         res.json({success:false, message:'Id is required'})
    //     }else{
    //         Notify.find({receiverId:req.params.userId},(err, notifies)=>{
    //             console.log(notifies);
                
    //             if(err){
    //                 res.json({success:false, message:'No user found'})
    //             }else{
    //                 if(!notifies){
    //                     res.json({success:false, message:'No notify found'})
    //                 }else{
                    
    //                     res.json({success:true, notifies:notifies})
    //                 }
    //             }
    //         })
    //     }
     })
    return router;
}