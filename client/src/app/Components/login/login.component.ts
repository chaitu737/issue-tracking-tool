import { Component, OnInit } from '@angular/core';
import { Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService,SocialUser,GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { Userservice } from 'src/app/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public user:any = SocialUser;

  hide = true;
  Userdata;

  email = new FormControl('',[Validators.required, Validators.email]);
  username= new FormControl('', Validators.required);
  password= new FormControl('', Validators.required);
  message: any;
  messageClass: string;
  

  constructor(
    private router:Router,
    private userService:Userservice,
    private socialAuthService: AuthService
  ) { }
  Login(){
  let user = {
    username:this.username.value,
    password:this.password.value

  }
  
  this.userService.login(user).subscribe(data=>{
    console.log(data);
   this.Userdata = data;
   if(!this.Userdata.success){
     this.messageClass = 'alert alert-danger';
     this.message = this.Userdata.message;
   }else{
     this.messageClass = 'alert alert-success';
     this.message = this.Userdata.message;
     localStorage.setItem('authToken', this.Userdata.token);
     localStorage.setItem('userId',this.Userdata.user.userId);
     localStorage.setItem('Username', this.Userdata.user.username);
    this.router.navigate(['/issue']);

   }
  })

  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      
       socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }



    this.socialAuthService.signIn(socialPlatformProvider).then((userdata)=>{
          
        let data = {
          email: userdata.email,
          username: userdata.name
  
        }
        
        this.userService.socialSign(data).subscribe((data)=>{
        this.user = data;
        console.log(this.user);
        if(!this.user.success){
          this.messageClass ='alert alert-danger';
        this.message = this.user.message;
        }else{
          this.message = this.user.message;
          this.messageClass ='alert alert-success';
          localStorage.setItem('authToken', this.user.token);
     localStorage.setItem('userId',this.user.user.userId);
     localStorage.setItem('Username', this.user.user.username);
    this.router.navigate(['/issue']);
        }
        })
          
    })
  
  }

  ngOnInit() {
  }

}
