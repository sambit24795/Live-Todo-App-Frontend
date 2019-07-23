import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenSub: Subscription;
  isAuthenticated = false;
  fullName: string;
  constructor(
    private authService: AuthService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
  
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenSub = this.authService
      .getAuthstatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.fullName = this.authService.getFullName();
      });


  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenSub.unsubscribe();
  }
}
