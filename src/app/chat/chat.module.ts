import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from "./chat.component";
import {ChatRowComponent} from "./components/ChatRow/chatRow.component";

@NgModule({
  declarations: [ChatComponent, ChatRowComponent],
  imports: [
    CommonModule
  ]
})
export class ChatModule { }
