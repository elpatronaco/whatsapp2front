import {Component, OnDestroy, OnInit} from "@angular/core";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";
import {MessageService} from "../services/message.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-chat", styleUrls: ["./chat.component.sass"], template: `
    <div class="main__wrapper">
      <div class="main__window">
        <div class="sidebar">
          <div class="toolbar">
            <span class="avatar">PC</span>
          </div>
          <div class="rows__wrapper">
            <app-chat-row *ngFor="let chat of _chats" [openchat]="chat"></app-chat-row>
            <span class="new-chat-button" (click)="test()">+</span>
          </div>
        </div>
        <div class="chat__wrapper">
          <app-messaging></app-messaging>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  public _chats: IOpenChat[] = []
  private openChatsSubscription: Subscription | undefined;

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.openChatsSubscription = this.messageService.OpenChatsSubj.subscribe(value => {
      console.log(value)
      this._chats = value;
    })
  }

  ngOnDestroy() {
    this.openChatsSubscription?.unsubscribe();
  }

  test() {
    this.messageService.OpenChatsSubj.next([]);
  }
}
