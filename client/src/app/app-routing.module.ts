import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { IssueComponent } from './Components/issue/issue.component';
import { CreateComponent } from './Components/create/create.component';
import { EditComponent } from './Components/edit/edit.component';
import { NavComponent } from './Components/nav/nav.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';


const routes: Routes = [
 
  {
    path:'login',
    component: LoginComponent,
    canActivate:[NotAuthGuard]
  },
  {
path:'forget-password',
component:ForgetPasswordComponent
  },
  {
    path:'change-password/:userId',
    component:ChangePasswordComponent
  },

  {
    path:'register',
    component:RegisterComponent,
    canActivate:[NotAuthGuard]
    
  },  
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'issue',
    component:IssueComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'create',
    component:CreateComponent,
    canActivate:[AuthGuard]
  },

  {
    path:'edit/:id',
    component:EditComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
