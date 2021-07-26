import {Component, Input, OnInit} from "@angular/core";
import {IMessage} from "../../../models/Dto/Message/IMessage";
import {MessageService} from "../../../services/message.service";


@Component({
  selector: "app-messaging", styleUrls: ["./messaging.component.sass"], template: `
    <div class="chat__wrapper">
      <div class="chat__message__wrapper">
        <div *ngFor="let message of messages" class="chat__message"
             [ngClass]="message.amISender ? 'sender' : 'recipient'"
        >
          <div>{{message.content}}</div>
        </div>
      </div>
      <div class="bottom-row">
        <input id="messageInput" placeholder="Escribe un mensaje aquí" [(ngModel)]="message"
               (keyup.enter)="sendMessage()">
        <button (click)="sendMessage()" [disabled]="!message.length">
          <img src="assets/submitButton.svg">
        </button>
      </div>
    </div>
  `
})
export class MessagingComponent implements OnInit {
  public messages: IMessage[] = [];
  public message: string = "";

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.messageService.MessagesSubj.subscribe(x => {
      this.messages = x;
    })

    this.messageService.NewMessageSubj.subscribe(x => {
      this.messages.push(x);
    })
  }

  async sendMessage() {
    if (!this.message.length) return;

    await this.messageService.sendMessage(this.message, "54ff6201-fe6d-4dae-88dd-8fa99e613f3c");
    this.message = "";
  }
}
