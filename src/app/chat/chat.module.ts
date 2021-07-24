import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from "./chat.component";
import {ChatRowComponent} from "./components/ChatRow/chatRow.component";
import {MessagingComponent} from "./components/Messaging/messaging.component";

@NgModule({
  declarations: [ChatComponent, ChatRowComponent, MessagingComponent],
  imports: [
    CommonModule
  ]
})
export class ChatModule { }
