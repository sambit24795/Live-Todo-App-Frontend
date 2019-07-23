import { Component, OnInit, HostBinding } from '@angular/core';
import { routeMoveStateTrigger } from 'src/app/shared/animations';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [routeMoveStateTrigger]
})
export class SigninComponent implements OnInit {
  @HostBinding('@moveState') routeAnimation = true;
  hide = true;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  onSignin(form: NgForm){
    if(form.invalid){
      return ;
    }
    this.authService.signinUser(form.value.email, form.value.password)
  }

}
