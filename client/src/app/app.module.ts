import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocialLoginModule,AuthServiceConfig,GoogleLoginProvider,FacebookLoginProvider,LinkedInLoginProvider } from 'angularx-social-login';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule, MatSidenavModule, MatToolbarModule,MatButtonModule,MatListModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { Userservice } from './user.service';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { IssueComponent } from './Components/issue/issue.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { CreateComponent } from './Components/create/create.component';
import { NgxEditorModule } from 'ngx-editor';
import { ToastrModule } from "ngx-toastr";
import { NavComponent } from './Components/nav/nav.component';
import { EditComponent } from './Components/edit/edit.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';






export function AuthConfig(){
  let config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('793841228914-6g04mn8rkoctu5c995e32hnu06l805q8.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("602155606857027")
    },
    {
      id: LinkedInLoginProvider.PROVIDER_ID,
      provider: new LinkedInLoginProvider('')

    }
  ]);

  return config
}




@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    DashboardComponent,
    IssueComponent,
    CreateComponent,
    NavComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    NgxEditorModule,
    ToastrModule.forRoot()

  
    
  ],
  providers: [Userservice,NotAuthGuard, AuthGuard,{
    provide: AuthServiceConfig,
    useFactory: AuthConfig
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
