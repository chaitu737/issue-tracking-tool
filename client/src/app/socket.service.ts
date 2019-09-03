import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient,HttpHeaders,HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url= "http://localhost:3000";
  private socket;


  constructor(
    private http:HttpClient
  ) { this.socket = io(this.url)}

  public verifyUser = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
        observer.next(data);
      });
    })
   }
   public setUser = (authToken)=>{
    this.socket.emit('set-user', authToken);
  }

  public onlineUserList = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list',(userList)=>{
     observer.next(userList);
      })
    });
  }

  public disconnectedSocket = ()=>{
    return Observable.create((observer)=>{
    this.socket.on('disconnect',()=>{
      observer.next();
    });
    });
  }

  public sendNotify = (notifyObject)=>{
    this.socket.emit('notification', notifyObject)
  }


  public notify = (userId)=>{
    return Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
        console.log(data);
        observer.next(data);
      })
    })
  }
  public exitSocket = () => {
    this.socket.emit('disconnect');
    
    this.socket.disconnect();


  }
    

}
