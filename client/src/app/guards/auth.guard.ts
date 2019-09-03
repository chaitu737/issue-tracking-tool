import {Injectable} from '@angular/core';
import { CanActivate,Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Userservice } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private userService:Userservice,
        private router:Router
    ){

    }
    canActivate(){
        if(this.userService.loggedIn()){
            return true;

        }else{
        this.router.navigate(['/register'])
        }
    }
}