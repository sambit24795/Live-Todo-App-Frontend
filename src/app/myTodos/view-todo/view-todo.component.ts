import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-todo',
  templateUrl: './view-todo.component.html',
  styleUrls: ['./view-todo.component.css'],

})
export class ViewTodoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  backgroundClass(){
    return {
      'todo-card': this.data.status === 'todo',
      'done-card': this.data.status === 'done',
      'doing-card': this.data.status === 'doing'
    };
  }
  getDisableStatus(){
    return {
      'text-muted': this.data.status === 'done',
      'text-dark': this.data.status === 'todo',
      'text-warn': this.data.status === 'doing'
    }
  }

}
