const socket = require('socket.io');
const mongoose = require('mongoose');
const tokenlib = require('./tokenlib');
const shortID= require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const Notify = require('../models/notify');


let setServer = (server)=>{
    let userList = []
    let io = socket.listen(server);
    let myIo = io.of('')

    myIo.on('connection',(socket)=>{
        console.log('on connection verifying user');
        socket.emit('verifyUser', '');


        socket.on('set-user',(authToken)=>{
        
            console.log('set-user called');
        tokenlib.verifyToken(authToken, (err,decoded)=>{
                if(err){
                    socket.emit('auth-error',{status:500, error:'Please provide a  valid token'})
                }else{
                    console.log('user is verified...setting details');
                  console.log(decoded);
                    let currentUser =decoded;
                    
                    socket.userId = currentUser.userId;
                
                    let UserName = `${currentUser.username}`
                    console.log(`${UserName} is online`);
                   
                    
          let userObj= {userId: currentUser.userId,username:currentUser.username}
          userList.push(userObj)
          
          myIo.emit('online-user-list', userList);
        
        //  socket.room ="Chat"
        //  socket.join(socket.room)
        //  socket.to(socket.room).broadcast.emit('online-user-list',userList);
                }
             })
           
        })

    

        socket.on('disconnect', ()=>{
            console.log('User is disconnected');
        

            var removeIndex = userList.map(function(user){
                return user.userId;
            }).indexOf(socket.userId);

            userList.splice(removeIndex,1);
            console.log(userList);
        

        });




 


        socket.on('notification',(data)=>{
            // console.log('socket chat-msg called');
            
            data['notifyId']= shortID.generate();

            setTimeout(function(){
                eventEmitter.emit('save-notification', data);
            }, 2000)
            io.emit(data.receiverId, data)
        
        });



    // socket.on('typing', (fullName)=>{
    //     socket.emit('typing', fullName);
    // });

    })

}



eventEmitter.on('save-notification',(data)=>{
    let newNotify = new Notify({

        notifyId: data.notifyId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        issueId:data.issueId,
        message: data.message,
        // chatRoom: data.chatRoom || '',
        createdOn: data.createdOn

    });
    console.log(newNotify);
    newNotify.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Notification Is Not Saved.");
        }
        else {
            console.log("Notification is  Saved.");
        
        }
    });

}); 

module.exports = {
    setServer: setServer
}