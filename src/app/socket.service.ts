import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import {Observable, throwError, from} from 'rxjs';
import {Cookie} from 'ng2-cookies';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { UserModule } from './user/user.module';
import {tap, catchError} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class SocketService {

  
  private socket;

  public url ="https://chatapi.edwisor.com";

  constructor(public http:HttpClient) {

    this.socket= io('https://chatapi.edwisor.com');
   }


   public verifyUser=()=>{

      return Observable.create((observer)=>{

        this.socket.on('verifyUser', (data)=>{
          observer.next(data);
        });// end socket
      });//end observable
   }// end verifyUser


   public onlineUserList=()=>{

    return Observable.create((Observer)=>{

      this.socket.on('online-user-list', (userList)=>{
        Observer.next(userList);
      });// end socket
    
    
    console.log(Observer)});//end observable
 }// end user list


 public disconnectedSocket=()=>{

  return Observable.create((Observer)=>{

    this.socket.on('disconnect', ()=>{
      Observer.next();
    });// end socket
  });//end observable
}// end disconnect


    public setUser=(authToken)=>{
      this.socket.emit('set-user', authToken);
    }

    private handleError(err:HttpErrorResponse) {

      let errorMessage='';

      if(err.error instanceof Error){
        errorMessage=`An error occured:${err.error.message}`;

      }else{
        errorMessage=`Server returned code:${err.status}, error message is :${err.error.message}`;
      }

      console.error(errorMessage);

      return Observable.throw(errorMessage);
    }

    public SendChatMessage=(ChatMsgObject)=>{

      this.socket.emit('chat-msg', ChatMsgObject);
    }

    public chatByUserId=(userId)=>{
      
      return Observable.create((Observer)=>{

        this.socket.on('userId', (data)=>{
          Observer.next(data);
        });
      });
    }

    public markChatAsSeen=(userDetails)=>{

      this.socket.emit('mark-chat-as-seen', userDetails);

    }

    public getChat(senderId, receiverId, skip): Observable<any>{

      return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)
      .pipe(tap(data=>console.log("Data Received")),catchError(this.handleError));
    }
}
