import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription, Subject } from "rxjs";
import { OwlOptions } from "ngx-owl-carousel-o";
import { routeSlideStateTrigger } from "src/app/shared/animations";
import { FriendRequestService } from "src/app/services/friend-request.service";
import { filter, findIndex } from "rxjs/operators";
import { ListStateTrigger } from "../todos/animations";
import { CookieService } from "ngx-cookie-service";
import { SocketService } from "src/app/services/socket.service";
import { ErrorComponent } from "src/app/error/error/error.component";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-friend-list",
  templateUrl: "./friend-list.component.html",
  styleUrls: ["./friend-list.component.css"],
  animations: [routeSlideStateTrigger, ListStateTrigger]
})
export class FriendListComponent implements OnInit, OnDestroy {
  @HostBinding("@slideState") routeAnimation = true;

  constructor(
    private authservice: AuthService,
    private friendRequestService: FriendRequestService,
    private cookie: CookieService,
    private socketservie: SocketService,
    private snackBar: MatSnackBar
  ) {}
  friends: any = [];
  friendRequests: any = [];

  allUsers: any = [];
  receivedRequests: any = [];
  allFriends: any = [];
  userSubs: Subscription;
  friendSub: Subscription;
  requestSub: Subscription;
  durationInSeconds = 3;
  p = 1;
  q = 1;
  r = 1;
  friendIndex;

  ngOnInit() {
    this.authservice.getUsers();
    this.userSubs = this.authservice.getUpdateUserListener().subscribe(data => {
      this.allUsers = data;
      const userId = this.authservice.getUserId();
      const index = data.findIndex(user => user._id === userId);
      const frnArr = data[index].friends;
      this.allFriends = frnArr;
      const mappedIndexs = this.allFriends.map(user => user.id);
      const filterData = data.filter(data => data._id !== userId);
      this.friendRequestService.getRequests();
      this.friendSub = this.friendRequestService
        .getRequestListener()
        .subscribe(res => {
          this.friendRequests = res;

          const mappedId = res.map(id => id.receiver);
          const filterAfter = filterData.filter(
            data => !mappedId.includes(data._id)
          );
          const friendUserFilter = filterAfter.filter(
            data => !mappedIndexs.includes(data._id)
          );
          this.friends = friendUserFilter;
        });
    });
    this.friendRequestService.getSentRequests();
    this.requestSub = this.friendRequestService
      .getReceivedListener()
      .subscribe(res => {
        this.receivedRequests = res;
      });
  }

  requestSent(id: string, email: string, fullName: string) {
    this.friendRequestService.sendRequest(id, email, fullName);
  }

  onAccept(id: string, fullName: string, email: string) {
    const tempFriends = {
      id,
      fullName,
      email
    };
    const receiver = this.authservice.getUserId();
    this.authservice.addFriendArr(id, email, fullName).subscribe(res => {
      
      this.socketservie.onGetNotification({ data: res.message });
      this.socketservie.onShow().subscribe(data => {
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: data.data },
          panelClass: ["success"],
          verticalPosition: "top"
        });

      });

      this.allFriends.unshift(tempFriends);
      this.friendRequestService
        .cancelfriendRequest(id, receiver)
        .subscribe(res => {
          const index = this.receivedRequests.findIndex(
            user => user._id === id
          );
          this.receivedRequests.splice(index, 1);
        });
    });
  }

  onDecline(sender: string) {
    const receiver = this.authservice.getUserId();
    this.friendRequestService
      .cancelfriendRequest(sender, receiver)
      .subscribe(res => {
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: res.message },
          panelClass: ["delete"],
          verticalPosition: "top"
        });
        const index = this.receivedRequests.findIndex(
          user => user._id === sender
        );
        this.receivedRequests.splice(index, 1);
        const authUser = this.authservice.getUserId();
        if (authUser === sender) {
          const user = {
            id: authUser,
            fullName: this.cookie.get("fullName"),
            email: this.authservice.getEmail()
          };
          this.friends.unshift(user);
        }
      });
  }
  onCancel(id: string, receiver: string, sender: string) {
    this.friendRequestService
      .cancelfriendRequest(sender, receiver)
      .subscribe(res => {
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: res.message },
          panelClass: ["delete"],
          verticalPosition: "top"
        });

        const index = this.allUsers.findIndex(user => user._id === receiver);
        this.friendRequestService.getRequests();
        this.friendSub = this.friendRequestService
          .getRequestListener()
          .subscribe(res => {
            this.friendRequests = res;
          });
        this.friends.unshift(this.allUsers[index]);
      });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.friendSub.unsubscribe();
    this.requestSub.unsubscribe();
  }
}
