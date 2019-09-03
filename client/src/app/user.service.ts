import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tokenNotExpired } from 'angular-jwt';

const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": undefined })
}


@Injectable({
  providedIn: 'root'
})
export class Userservice {
  domain = 'http://localhost:3000';
  authToken;
  user;
  

  constructor(
    public http:HttpClient
  ) { }


  // storeUserData(token, user) {
  //   localStorage.setItem('token', token); // Set token in local storage
  //   localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
  //   this.authToken = token; // Assign token to be used elsewhere
  //   this.user = user; // Set user to be used elsewhere
  // }

  signIn(user){
  return this.http.post(this.domain + '/authentication/register', user).map(res=>res);
  }
login(user){
  return this.http.post(this.domain + '/authentication/login', user).map(res=>res);
}
forgetpassword(email){
return this.http.post(this.domain + '/authentication/forget-password', email).map(res=>res);
}
changepassword(data){
  return this.http.put(this.domain + '/authentication/change-password', data).map(res=>res);
}

logout(userId){
  return this.http.post(this.domain + '/authentication/logout', userId).map(res=>res);
}
getAllissues(){
  return this.http.get(this.domain + '/issues/allissues').map(res=>res);
}
getAllusers(){
  return this.http.get(this.domain + '/authentication/allusers').map(res=>res);
}
createIssue(data){
  let headers = new HttpHeaders();
  return this.http.post(this.domain + '/issues/createissue', data).map(res=>res);
}
getIssue(id){
  return this.http.get(this.domain + '/issues/issue/'+id ).map(res=>res);
}
updateIssue(data){
return this.http.put(this.domain + '/issues/updateissue', data).map(res=>res);
}

postComment(data){
  return this.http.put(this.domain + '/issues/comment', data).map(res=>res);
}
addWatcher(data){
  return this.http.post(this.domain + '/issues/watcher', data).map(res=>res);
}
addAssigne(data){
  return this.http.post(this.domain + '/issues/assigne', data).map(res=>res);
}
getNotify(id){
   return this.http.get(this.domain + '/notification/notify/'+ id).map(res=>res);
}
searchIssue(data){
  return this.http.get( this.domain+ `/issues/search?description=${data}`)
}
socialSign(data){
  return this.http.post(this.domain + '/authentication/social', data).map(res=>res);
}

loggedIn(){
  return localStorage.getItem('authToken');
}


}
