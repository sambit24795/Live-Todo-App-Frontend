import { Component, OnInit, HostBinding } from '@angular/core';
import { routeMoveStateTrigger } from 'src/app/shared/animations';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  animations: [routeMoveStateTrigger]
})
export class ForgotPasswordComponent implements OnInit {
  @HostBinding('@moveState') routeAnimation = true;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onclick(email: string){
    this.authService.sendValidateEmail(email);
  }
  
}
