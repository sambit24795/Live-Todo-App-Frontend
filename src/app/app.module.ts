import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InternationalPhoneNumberModule } from "ngx-international-phone-number";
import { NgxMatIntlTelInputModule } from "ngx-mat-intl-tel-input";
import { CookieService } from "ngx-cookie-service";
import { NgxPaginationModule } from 'ngx-pagination';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";
import { NewTodoComponent } from "./myTodos/new-todo/new-todo.component";
import { TodoComponent } from "./myTodos/todo/todo.component";
import { TodosComponent } from "./myTodos/todos/todos.component";
import { ViewTodoComponent } from "./myTodos/view-todo/view-todo.component";
import { EditTodoComponent } from "./myTodos/edit-todo/edit-todo.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { HeaderComponent } from "./header/header.component";
import { FriendListComponent } from './myTodos/friend-list/friend-list.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ErrorComponent } from './error/error/error.component';
import { ErrorInterceptor } from './error/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NewTodoComponent,
    TodoComponent,
    TodosComponent,
    ViewTodoComponent,
    EditTodoComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    FriendListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ErrorComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    InternationalPhoneNumberModule,
    NgxMatIntlTelInputModule,
    NgxPaginationModule,
    FlexLayoutModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ViewTodoComponent, EditTodoComponent, ErrorComponent]
})
export class AppModule {}
