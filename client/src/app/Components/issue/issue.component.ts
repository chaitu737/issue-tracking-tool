import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Issue } from './issue';
import { Userservice } from 'src/app/user.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IssueComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    

  public authToken:any;
  public cross: boolean = false;
  public searchText: string;

  public userInfo:any;
  public userId:any;
  public disconnectedSocket = false
  public userList:any
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public users = [];
  public issues = [];
  public title:string;
  public status:string;
  public reporter:string;
public reporterId:any
columnsToDisplay = ["title","reporterId","status", "date"];
expandedElement;

public assignee= new FormControl()
  description:string;
  dataSource = this.issues;


  constructor(
    private socketService:SocketService,
    private router:Router,
    private userService:Userservice
  ) { }

  ngOnInit() {
    this.searchText = '';
    this.cross = false;
    this.authToken = localStorage.getItem('authToken');
    this.userId = localStorage.getItem('userId');
    this.reporterId = this.userId;
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlinneUserList();
  
    this.getAllissues();
    
    
  this.expandedElement
  
  }

  search(filterValue) {
     this.cross = true;
     
     this.userService.searchIssue(this.searchText).subscribe((data)=>{
      
       this.issues = data['result'];
     })

     
  }

  public checkStatus(){
    if(localStorage.getItem('authToken')===undefined|| localStorage.getItem('authToken')===''||localStorage.getItem('authToken')===null){
      this.router.navigate(['']);
      return false
    }else{
      return true 
    }
    
  }

  public verifyUserConfirmation:any = ()=>{
    this.socketService.verifyUser().subscribe(()=>{
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
    })
  }

  public getOnlinneUserList:any=()=>{
    this.socketService.onlineUserList().subscribe((userList)=>{
      this.userList = [];  
      
      for(let x in userList){
        let temp = {
          'userId':userList[x].userId, 'name':userList[x].username
        };
        this.userList.push(temp);
        console.log(this.userList);
      
      }
    });
  }



public getAllissues(){
  this.userService.getAllissues().subscribe(data=>{
    const result:Issue[] = data['issue'];
    this.issues = result;
  

    
    
  });
}

}
