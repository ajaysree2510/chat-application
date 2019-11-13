import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import {SocketService} from './../../socket.service';
import {AppService} from './../../app.service';
import {Router} from '@angular/router';
import { Cookie} from 'ng2-cookies/ng2-cookies';
import {ToastrService} from 'ngx-toastr';
import {ChatMessage} from './chat';
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers:[SocketService],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
  
  @ViewChild('scrollMe', {static:false}) scrollMe:ElementRef;
  
  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  
  

  public authToken:any;
  public userInfo:any;
  public userList:any=[];
  public disconnectedSocket:boolean;
  
  public scrollToChatTop:boolean=false;

  public receiverId:any;
  public receiverName:any;
  public previousCHatList:any=[];
  public messageText:any;
  public messageList:any=[];
  public pageValue:number=0;
  public loadingPreviousChat:boolean=false;

  constructor(

    public AppService:AppService,
    public SocketService:SocketService,
    public router:Router,
    public toastr:ToastrService
  ) { 

  }

  ngOnInit() {

    this.authToken=Cookie.get('authToken');
    this.userInfo=this.AppService.getUserInfoFromLocalStorage();
    this.receiverId=Cookie.get('receiverId');
    this.receiverName=Cookie.get('receiverName');

    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=""){
      this.userSelectedToChat(this.receiverId,this.receiverName)
    }

    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnUserList();
    this.getMessageFromAUser();
  }

  public checkStatus:any=()=>{
    
    if(Cookie.get('authToken')=== undefined || Cookie.get('authToken')==='' || Cookie.get('authToken')===null){

      this.router.navigate(['/']);
    
      return false;
    
    }else{

      return true;
    }
  }

  public verifyUserConfirmation:any=()=>{

       this.SocketService.verifyUser().subscribe((data)=>{

        this.disconnectedSocket=false;

        this.SocketService.setUser(this.authToken);
        this.getOnUserList;
        
        
       });
  }

  public getOnUserList:any=()=>{

    this.SocketService.onlineUserList().subscribe((userList)=>{
      
      this.userList=[];
      for(let x in userList){
          
        let temp = {'userId':x, 'name':userList[x], 'unread':0, 'chatting':false};
        console.log(this.userList[0]);

        this.userList.push(temp);
      }

      console.log(this.userList);
  
      

    });

 }

  public sendMessageUsingKeyPress:any=(event:any)=> {

      if(event.keyCode===13){
        this.sendMessage();
      }
  }

  public sendMessage:any= () => {

      if(this.messageText){

      let chatMsgObject:ChatMessage={

        senderName:this.userInfo.firstName +" "+this.userInfo.lastName,
        senderId:this.userInfo.userId,
        receiverName:Cookie.get('receiverName'),
        receiverId:Cookie.get('receiverId'),
        message:this.messageText,
        createdOn:new Date()
      }

      console.log(chatMsgObject)
      this.SocketService.SendChatMessage(chatMsgObject)
      this.pushToChatWindow(chatMsgObject)
    }
  }

    public pushToChatWindow:any=(data)=>{

      this.messageText="";
      this.messageList.push(data);
      this.scrollToChatTop=false;
    }

    public getMessageFromAUser:any = () => {

      this.SocketService.chatByUserId(this.userInfo.userId).subscribe((data)=>{

        (this.receiverId==data.senderId)?this.messageList.push(data):""

        this.toastr.success(`${data.senderName} says : ${data.message}`)

        this.scrollToChatTop=false;

      });
    }

    public userSelectedToChat:any = (id, name) =>{

      this.userList.map((user)=>{

        if(user.userId==id){
          user.chatting=true;
        }
        else{
          user.chatting=false;
        }
      })

      Cookie.set('receiverId', id);

      Cookie.set('receiverName', name);

      this.receiverName=name;

      this.receiverId=id;

      this.pageValue=0;

      this.messageList = [];

      let chatDetails = {
        
        userId:this.userInfo.userId,
        senderId: id
      }


      this.SocketService.markChatAsSeen(chatDetails);
      this.getPreviousChatWithAUser();

    }

    public getPreviousChatWithAUser:any = () => {

      let previousData = (this.messageList.length>0 ? this.messageList.slice() : []);

      this.SocketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue*10).subscribe((apiResponse)=>{

          console.log(apiResponse);

          if(apiResponse.status === 200){

            this.messageList= apiResponse.data.concat(previousData);
          } else {

            this.messageList = previousData;
            this.toastr.warning('No Messages available')
          }

          this.loadingPreviousChat = false;
      }, (err)=> {

        this.toastr.warning('some error occured')
      })

    }

    public loadEarlierPageOfChat:any=()=>{

      this.loadingPreviousChat=true;

      this.pageValue++;
      this.scrollToChatTop=true;

      this.getPreviousChatWithAUser();
    }

    public logout:any=()=>{

      this.AppService.logout().subscribe((apiResponse)=>{

        if (apiResponse.status === 200){
          
          console.log("logout called")
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');

          this.SocketService.exitSocket()

          this.router.navigate(['/']);
        }else{
          this.toastr.error(apiResponse.message)
        }
      }, (err)=>{

          this.toastr.error('some error occured')
      });
    }
}
