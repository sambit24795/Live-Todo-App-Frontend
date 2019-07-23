import { Component, OnInit, HostBinding } from '@angular/core';
import { routeMoveStateTrigger } from 'src/app/shared/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { compareValidator } from '../signup/confirm-equal.validator';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations: [ routeMoveStateTrigger ]
})
export class ResetPasswordComponent implements OnInit {
  @HostBinding('@moveState') routeAnimation = true;
  hide = true ;
  resetForm: FormGroup;
  authToken;
  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authToken = this.route.snapshot.queryParamMap.get('authToken');

    this.resetForm =  new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl('', [Validators.required, compareValidator('password')]),
    })
  }

  onSubmit(){
     this.authService.resetPassword(this.resetForm.value.password, this.authToken)
  }

}
