import { Component, OnInit, HostBinding } from '@angular/core';
import { routeMoveStateTrigger } from 'src/app/shared/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { compareValidator } from './confirm-equal.validator';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [routeMoveStateTrigger]
})
export class SignupComponent implements OnInit {
  @HostBinding('@moveState') routeAnimation = true;
  hide = true ;
  signupForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }
  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    const authData: AuthData = {
      firstname: this.signupForm.value.firstname,
      lastname: this.signupForm.value.lastname,
      email: this.signupForm.value.email,
      phone: this.signupForm.value.phone,
      password: this.signupForm.value.password
    };
    this.authService.createUser(authData);
  }

  private initForm() {
    const firstname = '';
    const lastname = '';
    const email = '';
    const password = '';
    const confirm = '';
    const phone = '';
// tslint:disable-next-line: max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

    this.signupForm = new FormGroup({
      firstname: new FormControl(firstname, [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl(lastname, [Validators.nullValidator]),
      email: new FormControl(email, [Validators.required, Validators.pattern(emailregex)]),
      password: new FormControl(password, [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl(confirm, [Validators.required, compareValidator('password')]),
      phone: new FormControl(phone, [Validators.maxLength(20)]),
    });
  }

}
