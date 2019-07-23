import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { AnimateTimings } from "@angular/animations";
import { AuthService } from '../auth/auth.service';
import { SocketService } from './socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error/error.component';

const BACKEND_URL = environment.apiUrl + "/friendRequest/";
@Injectable({
  providedIn: "root"
})
export class FriendRequestService {
  friendRequest: any = [];
  receivedRequests: any = [];
  receivedRequestsSubject = new Subject<any>();
  friendRequestSubject = new Subject<any>();
  durationInSeconds = 3;
  constructor(private http: HttpClient, private authservice: AuthService, private socketservie: SocketService, private snackBar: MatSnackBar) {}

  sendRequest(id: string, email: string, fullName: string) {
    const friendRequest = {
      id: id,
      email: email,
      fullName: fullName
    };
    this.http.post<any>(BACKEND_URL, friendRequest).subscribe(res => {
      const pushData = {
        email: email,
        fullName: fullName,
        receiver: id,
        sender: this.authservice.getUserId() 
      };

      this.socketservie.onGetNotification({ data: res.message });
      this.socketservie.onShow().subscribe(data => {
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: data.data },
          panelClass: ["success"],
          verticalPosition: "top"
        });

      });
      this.friendRequest.push(pushData);
      this.friendRequestSubject.next([...this.friendRequest]);
      const authemail = this.authservice.getEmail();
      if (email === authemail) {
        this.receivedRequests.push(pushData);
      this.receivedRequestsSubject.next([...this.receivedRequests]);
      }
    });
  }

  getRequestListener() {
    return this.friendRequestSubject.asObservable();
  }

  getReceivedListener() {
    return this.receivedRequestsSubject.asObservable();
  }

  getRequests() {
    this.http.get<any>(BACKEND_URL).subscribe(res => {
      this.friendRequest = res.user;
      this.friendRequestSubject.next([...this.friendRequest]);
    });
  }
  cancelfriendRequest(sender: string, receiver: string) {
    const queryParams = `?sender=${sender}&receiver=${receiver}`
    return this.http.delete<{ message: string }>(BACKEND_URL + queryParams);
   }

  getSentRequests() {
    this.http
      .get<{ message: string; result: any }>(BACKEND_URL + "receiver")
      .subscribe(res => {
        this.receivedRequests = res.result;
        this.receivedRequestsSubject.next([...this.receivedRequests]);
      });
  }
}
