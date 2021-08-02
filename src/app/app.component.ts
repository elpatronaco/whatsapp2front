import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {IState} from "./store/state.module";
import {ValidateUserRequest} from "./store/global/global.actions";

@Component({
  selector: 'app-root',
  styleUrls: ["./app.component.sass"],
  template: "<div id='app'><router-outlet></router-outlet></div>"
})
export class AppComponent implements OnInit {
  constructor(private store: Store<IState>) {}

  ngOnInit() {
    this.store.dispatch(ValidateUserRequest());
  }
}
