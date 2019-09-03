import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Userservice } from 'src/app/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordData;

 form  = new FormGroup({
   password :new FormControl('', Validators.required),
   confirm: new FormControl('',Validators.required)
 }, {validators:this.matchingpasswords('password', 'confirm')})
  message: any;

  matchingpasswords(password, confirm){
   return (group:FormGroup)=>{
     if(group.controls[password].value===group.controls[confirm].value){
       return null;
     }else{
       return {'matchingpasswords':true}
     }
   }
  }
  

  constructor(
    private router: Router,
    private userService:Userservice,
    private Route: ActivatedRoute
  ) { 
    
  }

  submit(){
let data ={
  password: this.form.get('password').value,
  userId: this.Route.snapshot.paramMap.get('userId')
}


this.userService.changepassword(data).subscribe(data=>{
  console.log(data);
  this.passwordData = data;
  if(!this.passwordData.success){
    this.message = this.passwordData.message;
  }else{
    this.message = this.passwordData.message;
    this.router.navigate(['/login'])
  }
})

  }

  ngOnInit() {
  
  }

}
