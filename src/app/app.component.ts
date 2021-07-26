import {Component, OnInit} from '@angular/core';
import {MessageService} from "./services/message.service";

@Component({
  selector: 'app-root',
  styleUrls: ["./app.component.sass"],
  template: "<div id='app'><router-outlet></router-outlet></div>"
})
export class AppComponent implements OnInit {
  constructor(private messageService: MessageService) {
  }

  async ngOnInit() {
    await this.messageService.init();
  }
}
