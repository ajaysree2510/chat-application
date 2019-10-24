import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//imported components

import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './user/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { AppService } from './app.service';
import { SocketService } from './socket.service';



const appRoutes:Routes =[
  { path:'login', component:LoginComponent, pathMatch:'full'},
  { path:'', redirectTo:'login', pathMatch:'full'},
  { path:'**', component:LoginComponent}
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChatModule,
    UserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
