import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';


import {RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';
import { ChatRouteGuardService } from './chat-route-guard.service';

@NgModule({
  declarations: [ChatboxComponent, RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path:'chat', component: ChatboxComponent, canActivate:[ChatRouteGuardService]}
    ]),
    SharedModule
  ],
  providers:[ChatRouteGuardService]
})
export class ChatModule { }
