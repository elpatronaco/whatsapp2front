import {Component} from "@angular/core";


@Component({
  selector: "app-chat", styleUrls: ["./chat.component.sass"], template: `
    <div class="chat__wrapper">
      <div class="chat__window">
        <div class="sidebar">
          <div class="toolbar">
            <span class="avatar">PC</span>
          </div>
        </div>
        <div class="chat"></div>
      </div>
    </div>
  `
})
export class ChatComponent {

}
