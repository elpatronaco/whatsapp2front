import {Component, OnDestroy, OnInit} from "@angular/core";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";
import {MessageService} from "../services/message.service";
import {Subscription} from "rxjs";
import {UserService} from "../services/user.service";
import {IUser} from "../models/Dto/User/IUser";
import {AuthService} from "../services/auth.service";

@Component({
  selector: "app-chat", styleUrls: ["./chat.component.sass"], template: `
    <div class="main__wrapper">
      <div class="main__window">
        <div class="sidebar">
          <div class="new-contact__wrapper" [ngClass]="{'active': openMenu}">
            <header>
              <div>
                <img src="assets/arrow.svg" (click)="openMenu = false;">
                <p>Nuevo chat</p>
              </div>
            </header>
            <div class="new-contact__window">
              <app-chat-row *ngFor="let user of allUsers" [openchat]="{recipient: user}"></app-chat-row>
            </div>
          </div>
          <div class="toolbar">
            <span class="avatar">PC</span>
          </div>
          <div class="rows__wrapper">
            <app-chat-row *ngFor="let chat of chats" [openchat]="chat"></app-chat-row>
            <span class="new-chat-button" (click)="openNewContactMenu()" *ngIf="!openMenu">+</span>
          </div>
        </div>
        <div class="chat__wrapper" [class.bordered]="!openedChat">
          <app-messaging *ngIf="openedChat"></app-messaging>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  public chats: IOpenChat[] = [];
  public allUsers: IUser[] = [];
  public openMenu = false;
  public openedChat = false;
  private openChatsSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private messageService: MessageService, private userService: UserService) {
  }

  async ngOnInit() {
    this.openChatsSubscription = this.messageService.OpenChatsSubj.subscribe(value => {
      this.chats = value;
    })

    this.messageService.MessagesSubj.subscribe(value => {
      if (value.length)
        this.openedChat = true;
    })

    const tokens = this.authService.getTokens();

    if (tokens) await this.messageService.newSession(tokens.idToken);
  }

  ngOnDestroy() {
    this.openChatsSubscription?.unsubscribe();
  }

  openNewContactMenu() {
    this.userService.getAllUsers().subscribe(x => {
      this.allUsers = x;
      this.openMenu = true;
    })
  }
}
