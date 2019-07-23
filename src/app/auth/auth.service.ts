import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { CookieService } from 'ngx-cookie-service';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authListener = new Subject<boolean>();
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private users: any = [];
  private userSubject = new Subject<any>();
  private userId: string;
  private email: string;
  private fullName: string;
  private friendsArrSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookie: CookieService
  ) {}

  getToken() {
    return this.token;
  }


  getAuthstatusListener() {
    return this.authListener.asObservable();
  }

  getUpdateUserListener() {
    return this.userSubject.asObservable();
  }
  getFriendsArrListener() {
    return this.friendsArrSubject.asObservable();
  }


  getUserId() {
    return this.userId;
  }
  getEmail() {
    return this.email;
  }
  getFullName() {
    return this.fullName;
  }

 
  sendValidateEmail(email: string) {
    const post = {
      email
    };
    this.http.post<any>(BACKEND_URL, post).subscribe((res) => {
      this.router.navigate(['/signin']);
    });
  }

  resetPassword(password: string, authToken: string) {
    const resetData = {
      password: password,
      authToken: authToken
    }
    this.http.put(BACKEND_URL, resetData).subscribe((res) => {
      this.router.navigate(['/signin']);
    })
  }

  createUser(authData: AuthData) {
    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      response => {
        this.router.navigate(['/signin']);
      },
      error => {
        this.authListener.next(false);
      }
    );
  }

  getUsers() {
    this.http
      .get<any>(BACKEND_URL + 'getUsers')
      .subscribe(res => {
        this.users = res.user;
        this.userSubject.next([...this.users]);
      });
  }

  addFriendArr(id: string, email: string, fullName: string) {
    const arrObj = {
      id,
      email,
      fullName
    };
    return this.http.put<{ message: string; result: any }>(
      BACKEND_URL + 'friends',
      arrObj
    );
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  signinUser(email: string, password: string) {
    const authData = { password, email };
    this.http.post<any>(BACKEND_URL + 'signin', authData).subscribe(
      response => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expireDuration = response.expiresIn;
          this.setAuthTimer(expireDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.email = response.email;
          this.fullName = response.fullName;
          this.authListener.next(true);
          const now = new Date();
          const expiresInDuration = new Date(
            now.getTime() + expireDuration * 1000
          );
          this.saveAuthData(token, expiresInDuration, this.userId, email, this.fullName);

          this.router.navigate(['/myTodos']);
        }
      },
      error => {
        this.authListener.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expireDuration.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.authListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/signin']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expiresInDuration: Date,
    userId: string,
    email: string,
    fullName: string
  ) {
    this.cookie.set('token', token);
    this.cookie.set('expiration', expiresInDuration.toISOString());
    this.cookie.set('userId', userId);
    this.cookie.set('email', email);
    this.cookie.set('fullName', fullName)
  }

  private clearAuthData() {
    this.cookie.delete('token');
    this.cookie.delete('expiration');
    this.cookie.delete('userId');
    this.cookie.delete('email');
    this.cookie.delete('authtoken');
    this.cookie.delete('fullName');
    this.cookie.deleteAll();
  }

  private getAuthData() {
    const token = this.cookie.get('token');
    const expiresInDuration = this.cookie.get('expiration');
    const userId = this.cookie.get('userId');

    if (!token || !expiresInDuration) {
      return;
    }
    return {
      token,
      expireDuration: new Date(expiresInDuration),
      userId
    };
  }
}
