import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener
} from '@angular/core';
import { TodoModel } from '../todo.model';
import { ActivatedRoute } from '@angular/router';
import { promise } from 'protractor';
import { observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UndoService } from 'src/app/services/undo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authListenSub: Subscription;
  private userSubs: Subscription;

  @Output() deleteTask = new EventEmitter<void>();
  @Output() undoTask = new EventEmitter<void>();
  @Output() viewTask = new EventEmitter<void>();
  @Output() editTask = new EventEmitter<void>();
  @Input() todo: TodoModel ;
  @Input() markedIndex: number;
  creatorName: string;
  activateMarked = false;
  userId: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,

  ) {}

  ngOnInit() {
    this.authService.getUsers();
    this.userSubs = this.authService.getUpdateUserListener().subscribe(data => {
      const index = data.findIndex(user => user._id === this.todo.creator);
      if (data.length !== 0) {
        this.creatorName = data[index].fullName;
      } else {
        return;
      }

    });
    this.userId = this.authService.getUserId();
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenSub = this.authService
      .getAuthstatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }



  getStatusClass() {
    return {
      'badge-info': this.todo.status === 'todo',
      'badge-secondary': this.todo.status === 'done',
      'badge-warning': this.todo.status === 'doing'
    };
  }
  getDisableStatus() {
    return {
      'text-disable': this.todo.status === 'done'
    };
  }
  onUndo() {
    this.undoTask.emit();
  }

  onDelete() {
    this.deleteTask.emit();
  }

  onView() {
    this.viewTask.emit();
  }

  onEdit() {
    this.editTask.emit();
  }


  titleChange() {
    return {
      'title-color-todo': this.todo.status === 'todo',
      'title-color-doing': this.todo.status === 'doing'
    };
  }

  ngOnDestroy() {
    this.authListenSub.unsubscribe();
    this.userSubs.unsubscribe();
  }
}
