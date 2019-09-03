import { Component, OnInit } from '@angular/core';
import { Userservice } from 'src/app/user.service';
import { SocketService } from 'src/app/socket.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  ishidden:boolean= true;
userId:any;
notifications:any;
message; 
notifyArray;
logoutDetails;
Nonotify:boolean;
  messageClass: string;

  constructor(
    private userService:Userservice,
    private socketService:SocketService,
    private router:Router
  ) { }

 

  ngOnInit() {
   
    this.userId = localStorage.getItem('userId');
    console.log(this.userId);
    this.getNotify();
  }
  onClick(){
    
    if(this.userId ===null||undefined){
      console.log(this.userId);
      this.Nonotify = true;
      console.log('no notifications');
    
    }else{
      
      this.Nonotify = false;
      this.notifyArray = [];
    
      this.notifications.map(x=>{
      
        this.notifyArray.unshift(x)
        console.log(this.notifyArray);
      });
    
    
    }
  }


  isLoggedIn(){
    if(this.userId==null){
      this.ishidden= true;
      return this.ishidden;
    }else{
      return false;
    }
  }

  public logout: any = ()=>{
   
    this.message = 'Loggedout successfully'
    this.socketService.exitSocket();
    localStorage.clear();
    setTimeout(()=>{
      this.router.navigate(['/login'])
    }, 3000)
    // this.userId = localStorage.getItem('userId');
    // let data = {
    //   userId:this.userId
    // }
    // this.userService.logout(data).subscribe((data)=>{
    //   this.logoutDetails = data;
    //   console.log(this.logoutDetails);
    //   if(!this.logoutDetails.success){
    //     this.message = this.logoutDetails.message
    //   }else{
    //     this.message = this.logoutDetails.message;
    //     console.log(this.message);
    //     this.socketService.exitSocket();
        
    //     localStorage.clear();
    //     setTimeout(()=>{
    //       this.router.navigate(['/login'])
             

    //     }, 3000)
    //   }
    // })
  }

  public getNotify(){
    this.userId = localStorage.getItem('userId');
    this.userService.getNotify(this.userId).subscribe((data)=>{
      
      this.notifications = data['result'];
      console.log(this.notifications);
      
      if(!this.notifications.success){
       this.messageClass ='alert alert-danger';
        this.message= this.notifications.message;

      }
      this.messageClass ="alert alert-success";
      this.message = this.notifications.message;
    })
  }

}
