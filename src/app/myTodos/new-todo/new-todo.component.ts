import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ButtonStateTrigger, formStateTrigger, checkedStateTrigger,  } from './animations';
import { TodoService } from 'src/app/todo-service';


@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.css'],
  animations: [ ButtonStateTrigger, formStateTrigger, checkedStateTrigger]
})
export class NewTodoComponent implements OnInit, OnChanges {
  @Output() creationCancelled = new EventEmitter<void>();
  @Output() todoCreated = new EventEmitter<any>();
  todoForm: FormGroup;
  availableStatus = ['todo', 'doing', 'done'];
  public checked = false;

  public subtaskString = new FormControl(null);
  constructor(private todoService: TodoService) { }

ngOnChanges(changes:any){
}

  ngOnInit() {
    this.initForm();
  }

   onAddsubTodos(subinput: HTMLInputElement) {
    const subTodos = this.todoForm.get('subTodos') as FormArray;
    const name = subinput.value;
    subTodos.push(
      new FormGroup({
        name: new FormControl(name),
        check: new FormControl(this.checked)
      })
    );
    this.subtaskString.patchValue(null);
  }

  onSubmit() {
  const date: Date = this.todoForm.value.date;
  const todoForm = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      status: this.todoForm.value.status,
      date: date.toLocaleString(),
      subTodos: this.todoForm.get('subTodos').value as FormArray
    };

  //this.todoService.addtodos(todoForm)
  this.todoCreated.emit(todoForm);
  }
  onRemove(index: number) {
    (this.todoForm.get('subTodos') as FormArray).removeAt(index);
  }

  onCancel() {
    while ((this.todoForm.get('subTodos') as FormArray).length !== 0) {
      (this.todoForm.get('subTodos') as FormArray).removeAt(0);
    }
    this.todoForm.reset();
    this.creationCancelled.emit();

  }

  private initForm() {
    const title = '';
    const description = '';
    const date = '';
    const status = 'todo';
    const subTodos = new FormArray([]);

    this.todoForm = new FormGroup({
      title: new FormControl(title, [Validators.required, Validators.minLength(3)]),
      description: new FormControl(description, [Validators.required, Validators.minLength(3)]),
      date: new FormControl(date, Validators.required),
      status: new FormControl(status, Validators.required),
      subtaskString: this.subtaskString,
      subTodos
    });
  }

}
