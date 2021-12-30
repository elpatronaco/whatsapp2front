import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUserAuthenticate } from '../models/Dto/User/IUserAuthenticate';
import { LoginRequest } from '../store/global/global.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-landing',
  styleUrls: ['./landing.component.sass'],
  template: `
    <div class="landing__wrapper">
      <header class="landing__header">
        <img class="icon" src="assets/icon.svg" alt="whatsapp 2 logo" />
        <p>WHATSAPP 2 WEB</p>
      </header>
      <section class="landing__window">
        <h3>Inicia sesión</h3>
        <form class="login-form" #f="ngForm" (ngSubmit)="onSubmit(f)">
          <div class="form-group">
            <label for="phoneInput">Teléfono</label
            ><input
              id="phoneInput"
              name="phone"
              type="tel"
              required
              tabindex="1"
              [(ngModel)]="loginForm.phone"
            />
          </div>
          <div class="form-group">
            <label for="passwordInput">Contraseña</label
            ><input
              id="passwordInput"
              name="password"
              type="password"
              required
              minlength="8"
              tabindex="2"
              [(ngModel)]="loginForm.password"
            />
          </div>
          <button type="submit" [disabled]="f.invalid" tabindex="3">
            Enviar
          </button>
        </form>
      </section>
      <footer class="landing__footer">
        <div>
          Made with <span>&hearts;</span> by
          <a href="https://github.com/elpatronaco" target="_blank"
            >elpatronaco</a
          >
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent implements OnDestroy {
  loginForm: IUserAuthenticate = { phone: '', password: '' };
  loginSubscription: Subscription | undefined;

  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  async onSubmit(f: NgForm) {
    if (f.invalid && (f.touched || f.pristine)) return;

    this.store.dispatch(LoginRequest(this.loginForm));
  }
}
