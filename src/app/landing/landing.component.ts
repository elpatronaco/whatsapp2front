import {Component, OnDestroy} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {IUserAuthenticate} from "../models/dto/login";
import {Subscription} from "rxjs";


@Component({
  selector: "app-landing",
  styleUrls: ["./landing.component.sass"],
  template: `
    <div class="landing__wrapper">
      <div class="landing__header">
        <img class="icon" src="assets/icon.svg" alt="whatsapp 2 logo">
        <p>WHATSAPP 2 WEB</p>
      </div>
      <div class="landing__window">
        <h3>Inicia sesión</h3>
        <form class="login-form" #f="ngForm" (ngSubmit)="onSubmit(f)">
          <div class="form-group"><label for="phoneInput">Teléfono</label><input id="phoneInput" name="phone"
                                                                                 type="tel"
                                                                                 required
                                                                                 [(ngModel)]="loginForm.Phone">
          </div>
          <div class="form-group"><label for="passwordInput">Contraseña</label><input id="passwordInput"
                                                                                      name="password"
                                                                                      type="password" required
                                                                                      minlength="8"
                                                                                      [(ngModel)]="loginForm.Password">
          </div>
          <button type="submit" [disabled]="f.invalid">Enviar</button>
        </form>
      </div>
    </div>
  `
})
export class LandingComponent implements OnDestroy {
  loginForm: IUserAuthenticate = {Phone: '', Password: ''};
  loginSubscription: Subscription | undefined;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  async onSubmit(f: NgForm) {

    if (f.invalid || f.pristine || f.untouched) return;
    console.log("asdasdasd");
    this.loginSubscription = await this.auth.login(this.loginForm).subscribe(async res => {
      this.auth.saveTokens(res);

      await this.router.navigate(['chat']);
    });
  }
}
