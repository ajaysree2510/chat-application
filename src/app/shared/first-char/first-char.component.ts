import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-first-char',
  templateUrl: './first-char.component.html',
  styleUrls: ['./first-char.component.css']
})
export class FirstCharComponent implements OnInit, OnChanges {

  @Input() userName:string;
  @Input() userBg:string;
  @Input() userColor:string;

  public firstChar:string;
  private _name:string='';

  @Output() userNameAppear: EventEmitter<string> =  new EventEmitter<string>();

  constructor() { }

  ngOnInit():void {
    this._name=this.userName;
    this.firstChar=this._name[0];
  }

  ngOnChanges(changes:SimpleChanges){

    let name=changes.userName;
    this._name=name.currentValue;
    this.firstChar=this._name[0];
  }
}
