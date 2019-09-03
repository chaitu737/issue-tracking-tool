import {Injectable} from '@angular/core';
import { CanActivate,Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Userservice } from '../user.service';

@Injectable()
export class NotAuthGuard implements CanActivate{
    constructor(
        private userService:Userservice,
        private router:Router
    ){

    }
    canActivate(){
        if(this.userService.loggedIn()){
            this.router.navigate(['/issue'])
            return false;

        }else{
        return true
        }
    }
}