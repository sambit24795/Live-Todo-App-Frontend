import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TodoService } from "src/app/todo-service";
import { FormControl, FormGroup, FormArray, Validators } from "@angular/forms";
import {
  ButtonStateTrigger,
  formStateTrigger,
  checkedStateTrigger
} from "../new-todo/animations";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-edit-todo",
  templateUrl: "./edit-todo.component.html",
  styleUrls: ["./edit-todo.component.css"],
  animations: [ButtonStateTrigger, formStateTrigger, checkedStateTrigger]
})
export class EditTodoComponent implements OnInit {
  private editMode = false;
  todoForm: FormGroup;
  todoId: string;
  singleTodo: any;
  public checked = false;
  public subtaskString = new FormControl(null);
  constructor(
    private todoService: TodoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any> 
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onAddsubTodos(subinput: HTMLInputElement) {
    const subTodos = this.todoForm.get("subTodos") as FormArray;
    const name = subinput.value;
    subTodos.push(
      new FormGroup({
        name: new FormControl(name),
        check: new FormControl(null)
      })
    );
    this.subtaskString.patchValue(null);
  }

  backgroundClass() {
    return {
      "todo-card": this.data.status === "todo",
      "done-card": this.data.status === "done",
      "doing-card": this.data.status === "doing"
    };
  }
  onCancel() {
    this.dialogRef.close();
  }
  onEdit() {
    const date: Date = this.todoForm.value.date;
    const todoForm = {
      id: this.data.id,
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      status: this.todoForm.value.status,
      date: date.toLocaleString(),
      subTodos: this.todoForm.get("subTodos").value as FormArray,
      creator: null
    };
    this.todoService.updateTodo(todoForm, this.data.id);
    this.onCancel();
  }
  onRemove(index: number) {
    (this.todoForm.get('subTodos') as FormArray).removeAt(index);
  }

  private initForm() {
    const title = this.data.title;
    const description = this.data.description;
    const date = new Date(this.data.date);
    const status = this.data.status;
    const subTodos = new FormArray([]);

    if (this.data.subTodos.length > 0) {
      for (let subtodo of this.data.subTodos) {
        subTodos.push(
          new FormGroup({
            name: new FormControl(subtodo.name),
            check: new FormControl(subtodo.check)
          })
        );
      }
    }

    this.todoForm = new FormGroup({
      title: new FormControl(title, [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl(description, [
        Validators.required,
        Validators.minLength(3)
      ]),
      date: new FormControl(date, Validators.required),
      status: new FormControl(status, Validators.required),
      subtaskString: this.subtaskString,
      subTodos: subTodos
    });
  }
}
