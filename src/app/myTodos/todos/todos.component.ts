import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { TodoService } from '../../todo-service';
import { TodoModel } from '../todo.model';
import {
  SlideDownTrigger,
  ListStateTrigger,
  ItemStateTrigger,
  markedTrigger
} from './animations';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { ViewTodoComponent } from '../view-todo/view-todo.component';
import { routeSlideStateTrigger } from 'src/app/shared/animations';
import { Router } from '@angular/router';
import { EditTodoComponent } from '../edit-todo/edit-todo.component';
import { AuthService } from 'src/app/auth/auth.service';
import { UndoService } from 'src/app/services/undo.service';
import { ErrorComponent } from 'src/app/error/error/error.component';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  animations: [
    SlideDownTrigger,
    ListStateTrigger,
    ItemStateTrigger,
    markedTrigger,
    routeSlideStateTrigger
  ]
})
export class TodosComponent implements OnInit, OnDestroy {
  @HostBinding('@slideState') routeAnimation = true;
  todoArr: TodoModel[];
  todoSubcr = new Subscription();
  createNew = false;
  loadGet = false;
  showFriendList = false;
  progress = 'progressing';
  markedPrjIndex: number;
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  durationInSeconds = 3 ;

  pageSizeOption = [1, 3, 6, 9, 12];
  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private socketservie: SocketService,
    private authservice: AuthService,
    private undoService: UndoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.todoService.getTodo(this.postsPerPage, this.currentPage);
    this.todoSubcr = this.todoService.todoSubjectListener().subscribe(data => {
      this.todoArr = data;
      this.progress = 'finished';
      this.totalPosts = this.todoService.getCount();
      if (this.loadGet === true) {
        this.totalPosts = this.todoService.getCount();
        this.todoService.getTodo(this.postsPerPage, this.currentPage);
      }
      this.loadGet = false;
    });
  }

  onClick() {
    this.authservice.getUsers();
  }

  onCreated(event: Event) {
    this.todoService.addtodos(event);
    this.todoService.getTodo(this.postsPerPage, this.currentPage);
    this.createNew = false;
    this.loadGet = true;
  }
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.todoService.getTodo(this.postsPerPage, this.currentPage);
  }

  onView(index: number) {
    const singleTask = this.todoService.getSingleTask(index);
    this.dialog.open(ViewTodoComponent, { data: singleTask });
  }

  /* @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode == 90) {
     console.log($event, this.clickedIndex)
    }
    } */


  onUndo(index: number) {
    const singleTask = this.todoService.getSingleTask(index);
    this.undoService.deleteLatest(singleTask.id).subscribe(res => {
    });
    const tindex = this.todoArr.findIndex(todo => todo.id === singleTask.id);
    this.undoService.getUndoTasks(singleTask.id).subscribe(res => {
      if (res.result.length === 0 ) {

        this.todoService.getTodo(this.postsPerPage, this.currentPage);

        this.currentPage = 1;
        this.postsPerPage = 3;
    }
      const mappedRes = res.result.map((res) => {
        return {
          id: res.todoId,
        title: res.title,
        creator: res.creator,
        description: res.description,
        status: res.status,
        subTodos: res.subTodos,
        date: res.date
        };
      });
      this.todoArr[tindex] = mappedRes[0];

      this.todoService.updateTodo(mappedRes[0], singleTask.id);
      this.undoService.deleteLatest(singleTask.id).subscribe(res => {
      });
    });
  }

  onEdit(index: number) {
    const singleTask = this.todoService.getSingleTask(index);
    this.dialog.open(EditTodoComponent, { data: singleTask });
    this.loadGet = true;
  }

  onDeleteTask(index: number) {
    const id = this.todoService.getSingleTask(index).id;
    const singleTask = this.todoService.getSingleTask(index);
    this.todoService.deleteTodo(id).subscribe((response) => {
      this.todoService.getTodo(this.postsPerPage, this.currentPage);
      this.socketservie.onGetNotification({ data: `Task ${singleTask.title} ${response.message}` });
      this.socketservie.onShow().subscribe(data => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ['delete'],
            verticalPosition: 'top'
          });
        });
    });
    this.currentPage = 1;
    this.postsPerPage = 3;
  }

  ngOnDestroy() {
    this.todoSubcr.unsubscribe();
  }
}
