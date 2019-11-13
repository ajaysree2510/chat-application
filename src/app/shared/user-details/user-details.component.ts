import { Component, OnInit, OnChanges,Input, EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  @Input() userFirstName:any;
  @Input() userLastName:string;
  @Input() userStatus:String;
  @Input() messageRead: string;

  public firstChar:string;


  constructor() { }

  ngOnInit():void{

    this.firstChar=this.userFirstName[0];
  }

}
