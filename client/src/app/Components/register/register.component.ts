import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService,SocialUser,GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { Userservice } from 'src/app/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public user:any = SocialUser;
  UserData;
  hide = true;
email = new FormControl('',[Validators.required, Validators.email]);
username= new FormControl('', Validators.required);
password= new FormControl('', Validators.required);
  message: any;
  messageClass;



  constructor(private socialAuthService: AuthService,
    private userService: Userservice,
    private router:Router) { }


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

  register(){
    let data = {
      email:this.email.value,
      username:this.username.value,
      password:this.password.value
    }
  this.userService.signIn(data).subscribe(data=>{
    console.log(data);
    this.UserData = data;
    if(!this.UserData.success){
      this.messageClass = 'alert alert-danger'; // Set a success class

      this.message = this.UserData.message;

    }else{
      if(this.UserData.success){
        this.messageClass ='alert alert-success'
        this.message = this.UserData.message;
        setTimeout(()=>{
          this.router.navigate(['/login']);
        },2000)
      }
    }
  });
  }
    
  
  ngOnInit() {
  }

}
