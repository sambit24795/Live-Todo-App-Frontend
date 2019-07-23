import { Injectable } from "@angular/core";
import { TodoModel } from "./myTodos/todo.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "../environments/environment";
import { ErrorComponent } from './error/error/error.component';
import { SocketService } from './services/socket.service';
import { MatSnackBar } from '@angular/material';

const BACKEND_URL = environment.apiUrl + "/todos/";

@Injectable({
  providedIn: "root"
})
export class TodoService {
  private todos: TodoModel[] = [];
  private todoSubject = new Subject<any>();
  private count;
  durationInSeconds = 3;

  constructor(private http: HttpClient, private socketservie: SocketService, private snackBar: MatSnackBar) {}

  getCount() {
    return this.count;
  }

  getTodo(todoPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${todoPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; result: any; maxtodos: number }>(
        BACKEND_URL + queryParams
      )
      .subscribe(response => {
        const todos = response.result.map(data => {
          const subResTodos = data.subTodos.map(subData => {
            return {
              name: subData.name,
              check: subData.check
            };
          });
          return {
            id: data._id,
            title: data.title,
            description: data.description,
            date: data.date,
            subTodos: subResTodos,
            status: data.status,
            creator: data.creator
          };
        });
        this.count = response.maxtodos;
        this.todos = todos;
        this.todoSubject.next([...this.todos]);
      });
  }

  todoSubjectListener() {
    return this.todoSubject.asObservable();
  }

  getSingleTask(index: number) {
    return this.todos[index];
  }

  addtodos(todo: any) {
    this.http
      .post<{ message: string; result: any }>(BACKEND_URL, todo)
      .subscribe(response => {
        const subTodosRes = response.result.subTodos;
        const subTodos = subTodosRes.map(data => {
          return {
            name: data.name,
            check: data.check
          };
        });

        const todo = {
          id: response.result._id,
          title: response.result.title,
          description: response.result.description,
          date: response.result.date,
          subTodos,
          status: response.result.status,
          creator: response.result.creator
        };
        setTimeout(() => {
          this.todos.unshift(todo);
          this.todoSubject.next([...this.todos]);
        }, 300);

        this.socketservie.onGetNotification({ data: response.message });
        this.socketservie.onShow().subscribe(data => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });

        });
      });
  }
  getTodobyId(id: string) {
    return this.todos.findIndex(data => data.id === id);
  }

  updateAfterUndo(todo: any) {
    this.http.put<any>(BACKEND_URL, todo).subscribe(res => {
      console.log(res);
      const updatedTodo = [...this.todos];
      const oldIndex = this.todos.findIndex(
        oldTodo => oldTodo.id === todo.todoId
      );
      const editedTodo = {
        id: todo.todoId,
        title: todo.title,
        description: todo.description,
        date: todo.date,
        subTodos: todo.subTodos,
        status: todo.status,
        creator: todo.creator
      };
      updatedTodo[oldIndex] = editedTodo;
      this.todos = updatedTodo;
      this.todoSubject.next([...this.todos]);
    });
  }

  updateTodo(todo: any, id: string) {
    this.http
      .put<{ message: string; documents: any }>(BACKEND_URL + id, todo)
      .subscribe(res => {
        console.log(res);
        const updatedTodo = [...this.todos];
        const oldIndex = this.todos.findIndex(oldTodo => oldTodo.id === id);
        const editedTodo = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          date: todo.date,
          subTodos: todo.subTodos,
          status: todo.status,
          creator: todo.creator
        };
        updatedTodo[oldIndex] = editedTodo;
        this.todos = updatedTodo;
        this.todoSubject.next([...this.todos]);

        this.socketservie.onGetNotification({ data: res.message });
        this.socketservie.onShow().subscribe(data => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["warning"],
            verticalPosition: "top"
          });
        });
      });
  }

  deleteTodo(id: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + id);
  }
}
