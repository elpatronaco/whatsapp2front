import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {IMessage} from "../../../models/Dto/Message/IMessage";
import {MessageService} from "../../../services/message.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {IState} from "../../../store/state.module";
import {getMessages} from "src/app/store/global/global.selectors";
import {IUser} from "../../../models/Dto/User/IUser";


@Component({
  selector: "app-messaging", styleUrls: ["./messaging.component.sass"], template: `
    <div class="chat__wrapper">
      <header>
        <img src="assets/userplaceholder.svg" class="avatar">
        <p>{{recipient.username}}</p>
      </header>
      <section class="chat__message__wrapper" #messagesWrapper>
        <div>
          <div *ngFor="let message of messages" class="chat__message"
               [ngClass]="message.amISender ? 'sender' : 'recipient'"
          >
            <div>{{message.content}}</div>
          </div>
        </div>
      </section>
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
export class MessagingComponent implements OnInit, OnDestroy {
  @Input("recipientUser") recipient: IUser;
  @ViewChild("messagesWrapper") messagesWrapper: ElementRef;

  public messages: IMessage[] = [];
  public message: string = "";
  private messagesSubscription: Subscription;

  constructor(private messageService: MessageService, private store: Store<IState>) {
  }

  ngOnInit() {
    this.messagesSubscription = this.store.select(getMessages).subscribe(messages => {
      this.messages = messages;
      setTimeout(() => {
        this.messagesWrapper.nativeElement.scrollTop = this.messagesWrapper.nativeElement.scrollHeight;
      }, 1);
    })
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
  }

  async sendMessage() {
    if (!this.message.length) return;

    await this.messageService.sendMessage(this.message.trim(), this.recipient.id);
    this.message = "";
  }
}
