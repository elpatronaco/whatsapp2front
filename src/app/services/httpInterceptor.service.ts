import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";


@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({url: `${environment.backendUrl}/${req.url}`});

    const tokens = this.auth.getTokens();

    if (tokens) {
      clonedRequest.headers.set("Authorization", `Bearer ${tokens.IdToken}`);
    }

    return next.handle(clonedRequest);
  }
}
