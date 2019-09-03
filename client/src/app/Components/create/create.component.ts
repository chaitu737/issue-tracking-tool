import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Userservice } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EditComponent } from '../edit/edit.component';

export function toFormData<T>(formValue:T){
  const fd = new FormData();
for(const key of Object.keys(formValue)){
  
  const value = formValue[key];
  console.log(value)

  fd.append(key, value);
}
return fd;

}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
public title:string;
public users=[];
public selectedFile:File = null;
  public status:string;
  public userId;
public reporterId;
public issueResponse;
  public description:string;
  public assignee = new FormControl();


editorConfig = {
  "editable": true,
  "spellcheck": true,
  "height": "auto",
  "minHeight": "0",
  "width": "auto",
  "minWidth": "0",
  "translate": "yes",
  "enableToolbar": true,
  "showToolbar": true,
  "placeholder": "Enter text here...",
  "imageEndPoint": "",
  "toolbar": [
    ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
    ["fontName", "fontSize", "color"],
    ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
    ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
    ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
    ["link", "unlink"]
  ]
}

options = ["backlog", "in-progress", "testing", "done"];
  message: any;
  messageClass: string;


  constructor(
    private userService:Userservice,
    private toastr:ToastrService,
    private router:Router,
  ) { 
    this.userId = localStorage.getItem('userId');
  }

  onFileSelected(event){
    if (event.target.files && event.target.files.length) {
      const [selectedFile] = event.target.files;
      this.selectedFile = selectedFile;
  
    }
  }



  ngOnInit() {
    this.reporterId = localStorage.getItem('userId');
    this.getallUsers();
  }

  onChange(value){
    this.status = value;
    console.log(this.status);
  }

getallUsers(){
  this.userService.getAllusers().subscribe(data=>{
    let users = data['result'];
    users.map(x=>{
      let userObj ={
        name:x.username,
        userId:x.userId
      }
    
      if(x.userId!=this.userId &&x.userId!=this.reporterId){
        this.users.push(userObj)
      console.log(this.users);
      }
    });

  })
};



onSubmit(){
  
  if(!this.title){
   this.toastr.warning('Title is required')
  }else{
    if(!this.description){
      this.toastr.warning('Description is required')
    }else{
      if(!this.status){
        this.toastr.show('Please select status');
      }else{
        if(!this.selectedFile){
        this.toastr.warning('Select a Image');
        }else{
          if(!this.assignee.value){
            this.toastr.warning('Add an assigne');
          }else{
            

            let data = {
              title: this.title,
              status:this.status,
              description:this.description,
              assigne:JSON.stringify(this.assignee.value),
              image:this.selectedFile,
              reporterId:localStorage.getItem('userId')
            }
            console.log(JSON.stringify(this.assignee.value));
            console.log(data);
          this.userService.createIssue(toFormData(data)).subscribe(response=>{
            this.issueResponse = response;
            if(!this.issueResponse){
              this.messageClass ="alert alert-danger";
              this.message="Some error occured try again";

            }else{
              if(!this.issueResponse.success){
                this.messageClass ='alert alert-danger';
                this.message =this.issueResponse.message.message;
              }else{
                this.message ='Issue created successfully';
                this.messageClass ="alert alert-success";
              
              
                this.router.navigate(['/issue']);
              }
            }
            
          })
          }
        }
      }
    }
    
  }
}

}
