import {Component} from "@angular/core";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";
import {IUser} from "../models/Dto/User/IUser";

const user: IUser = {Id: "asdkasdas12312", Phone: "615927034", Username: "elPatron"}

@Component({
  selector: "app-chat", styleUrls: ["./chat.component.sass"], template: `
    <div class="chat__wrapper">
      <div class="chat__window">
        <div class="sidebar">
          <div class="toolbar">
            <span class="avatar">PC</span>
          </div>
          <div class="rows-container">
            <app-chat-row *ngFor="let chat of _chats" [openchat]="chat"></app-chat-row>
          </div>
        </div>
        <div class="chat"></div>
      </div>
    </div>
  `
})
export class ChatComponent {
  public _chats: IOpenChat[] = []

  ngOnInit() {
    for (let i = 0; i < 50; i++)
      this._chats.push({
        Recipient: user,
        LastMessage: {
          Recipient: user, Sender: user,
          Id: "1231230asd123123", Content: "jipaodiñas dasndaosidaspd asidauosduanosdnasd asda sdasdasdasdds asdoasd0nasd",
          SentDate: new Date()
        }
      });
  }
}
