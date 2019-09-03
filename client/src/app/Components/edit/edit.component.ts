import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Userservice } from 'src/app/user.service';
import { FormControl } from '@angular/forms';
import { SocketService } from 'src/app/socket.service';

// export function toFormData<T>(formValue:T){
//   const fd = new FormData();
// for(const key of Object.keys(formValue)){
  
//   const value = formValue[key];


//   fd.append(key, value);
// }
// return fd;

// }



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
   editMode: boolean= false;
 issueId;
 issueDetails;
 message;
 issue;
 issueUpdated;
 comment:string;
 commentDetails;
 comments;
 public userId;
 public reporterId;
 username;
 public users=[];
public assignes =new FormControl();
selectedFile:File;
status;
description:string;
image1:File;
assignees=[];
watchers =[];
 editorConfig = {
  "editable": true,
  "spellcheck": true,
  "height": "auto",
  "minHeight": "0",
  "width": "auto",
  "minWidth": "0",
  "translate": "yes",
  "enableToolbar": true,
  "showToolbar": true,
  "placeholder": "Enter text here...",
  "imageEndPoint": "",
  "toolbar": [
    ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
    ["fontName", "fontSize", "color"],
    ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
    ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
    ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
    ["link", "unlink"]
  ]
}
  title:string;
  watcherDetails;
  assigneDetails;
  messageClass: string;
  constructor(
    private router:Router,
    private active:ActivatedRoute,
    private  userService:Userservice,
    private socketService:SocketService
  ) {        
   
  }

 

  

  options = ["backlog", "in-progress", "testing", "done"];

  ngOnInit() {
  
  
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('Username');
    this.getNotify(); 
    this.issueId = this.active.snapshot.params;
    this.getallUsers();
    this.getIssueById(); 


} 


 public  getallUsers(){
    this.userService.getAllusers().subscribe(data=>{
      let users = data['result'];
      
      users.map(x=>{
        let userObj ={
          name:x.username,
          userId:x.userId
        }
      
        if(x.userId!=this.userId &&x.userId!=this.reporterId){
          this.users.push(userObj)
      
        
        }
      });
  
    });
  
  
  };

  onFileSelected(event){
    if (event.target.files && event.target.files.length) {
      const [selectedFile] = event.target.files;
      this.selectedFile = selectedFile;
      
  
    }
  }
  onChange(value){
    this.status = value;
    
  }

onSave(){
  let assigne = JSON.stringify(this.issue.assignes) 
  console.log(assigne);
  
  
  const fd = new FormData();

  fd.append('image', this.selectedFile)

  fd.append('title', this.issue.title)
  fd.append('description', this.issue.description)
  fd.append('status', this.issue.status)
  fd.append('assignee', assigne)
  fd.append('issueId', this.issue.issueId)
  fd.append('reporterId', this.issue.reporterId)
  fd.append('image1', this.image1 )

 
this.userService.updateIssue(fd).subscribe(data=>{
this.issueUpdated = data;
if(!this.issueDetails.success){
  this.message = this.issueDetails.message
}else{
  this.message = this.issueDetails.message
  this.router.navigate(['/issue'])
}


})  
};



postComment(){
  
  let  commentObj = {
    issueId: this.issueId.id,
    comments :JSON.stringify(this.comment),
    name:localStorage.getItem('Username')
  } 

this.userService.postComment(commentObj).subscribe(data=>{
  

   this.commentDetails = data;
   if(!this.commentDetails.success){
     this.messageClass="alert alert-danger";
     this.message = this.commentDetails.message;

   }else{


     this.messageClass ="alert alert-success";
     this.message = this.commentDetails.message;
     this.notification(`${localStorage.getItem('Username')} commented on  this issue ${this.issue.title}`)
     this.ngOnInit();
     this.comment='';

   }
});


}

addWatcher(){
 let data = {
   issueId: this.issueId.id,
   watcher:localStorage.getItem('Username'),
   userId:localStorage.getItem('userId')
   
 }
 
 
 this.userService.addWatcher(data).subscribe(data=>{
   
  
   this.watcherDetails=data;
  if(!this.watcherDetails.success){
    this.message = this.watcherDetails.message
    
  }else{
    this.message = this.watcherDetails.message 
    this.notification(`${localStorage.getItem('Username')} is watching this issue ${this.issue.title}`)
    this.ngOnInit();
    
  }
 })
};

public notification(message){
  // this.comments.map(x=>{
  //   let notifyObj = {
  //     senderName: x.name,
  //     senderId:this.userId,
  //     receiverId:this.reporterId,
  //     message:message


  //   }
  //   this.socketService.sendNotify(notifyObj);
  // })
this.watchers.map(x=>{
  let notifyObj = {
    senderName: localStorage.getItem('Username'),
    senderId: this.userId,
    receiverName:x.name,
    receiverId:x.userId,
    issueId:this.issueId.id,
    message:message
  }
  console.log(notifyObj);
  this.socketService.sendNotify(notifyObj)
});

this.assignees.filter(x=>{

  for(let y of this.users){
  if(x == y.name){
    let notifyObj = {
      senderName:localStorage.getItem('Username'),
      senderId:this.userId,
      receiverName:x,
      receiverId: y.userId,
      issueId:this.issueId.id,
      message:message  
    }
    console.log(notifyObj);
    this.socketService.sendNotify(notifyObj)

  }
  }
  
  
});
if(this.userId != this.reporterId){
  let notifyObj = {
    senderName: localStorage.getItem('Username'),
    senderId:this.userId,
    receiverId:this.reporterId, 
    issueId:this.issueId.id,
    message:message
  }
  console.log(notifyObj);
  
  this.socketService.sendNotify(notifyObj)
}



}


public getNotify=()=>{
this.socketService.notify(localStorage.getItem('userId')).subscribe((data)=>{
  console.log(data);
})
}

addAssignee(){
  let data = {
    issueId: this.issueId.id,
    assigneArray:JSON.stringify(this.issue.assignes),
    userId:this.userId

  }
  console.log(typeof data.assigneArray);
  this.userService.addAssigne(data).subscribe((data)=>{
    this.assigneDetails= data;
    if(!this.assigneDetails.success){
      this.messageClass="alert alert-danger";
      this.message = this.assigneDetails.message
    }else{ 
      this.messageClass = "alert alert-success";
      this.message = this.assigneDetails.message
      this.notification(`${this.username} is added   as Assigne for ${this.issue.title}`)
    
    }
  })


  
}


public getIssueById(){
  this.userService.getIssue(this.issueId.id).subscribe(data=>{

    this.issueDetails = data;
    
    if(!this.issueDetails.success){
      this.message = this.issueDetails.message;
    }else{
  this.issue = this.issueDetails.issue;
  
  this.image1 = this.issueDetails.issue.image;
  this.reporterId = this.issue.reporterId;
  this.comments = this.issue.comments;
  
  
  this.issue.watcher.map(x=>this.watchers.push(x.watcher));
    
  this.issue.assignes.map(x=>this.assignees.push(x));
  }
    })
    
}


 

}
