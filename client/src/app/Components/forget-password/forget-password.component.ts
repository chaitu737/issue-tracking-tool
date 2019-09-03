import { Component, OnInit } from '@angular/core';
import { Validators, FormControl  } from '@angular/forms';
import { Router } from '@angular/router';
import { Userservice } from 'src/app/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  emailData;
  email = new FormControl('',[Validators.required, Validators.email]);
  message: any;
  messageClass: string;
 

  constructor(
    private router:Router,
    private userService:Userservice
  ) { }
  submit(){
    let data = {
      email:this.email.value
    }
     console.log(data);
this.userService.forgetpassword(data).subscribe(data=>{
  console.log(data);
this.emailData = data;
if(!this.emailData.success){
  this.messageClass ='alert alert-danger';
  this.message= this.emailData.message
}else{
  this.messageClass ='alert alert-success';
  this.message = this.emailData.message;
  this.router.navigate(['/login'])

  
}
})
    
   
  }

  ngOnInit() {
  }

}
