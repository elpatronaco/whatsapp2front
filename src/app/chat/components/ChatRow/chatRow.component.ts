import {Component, Input} from "@angular/core";
import {IOpenChat} from "../../../models/Dto/Chat/IOpenChat";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: "app-chat-row", styleUrls: ["./chatRow.component.sass"], template: `
    <div class="row__wrapper" *ngIf="chat !== undefined" (click)="onSelect()">
      <span class="avatar">{{chat.Recipient?.Username?.toUpperCase()?.charAt(0)}}</span>
      <div class="additional-info__wrapper">
        <p class="additional-info__recipient">{{chat.Recipient.Username}}</p>
        <p class="additional-info__message">{{chat.LastMessage.Content}}</p>
      </div>
    </div>
  `
})
export class ChatRowComponent {
  @Input("openchat") chat: IOpenChat | undefined;

  constructor(private chatService: MessageService) {
  }

  async onSelect() {
    if (this.chat)
      await this.chatService.openChat(this.chat.Recipient);
  }
}

