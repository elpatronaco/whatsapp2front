import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ITokens} from "../models/Dto/Auth/ITokens";
import {IUserAuthenticate} from "../models/Dto/User/IUserAuthenticate";


@Injectable({providedIn: "root"})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  saveTokens({AccessToken, IdToken}: ITokens) {
    sessionStorage.setItem("idToken", IdToken);
    sessionStorage.setItem("accessToken", AccessToken);
  }

  getTokens(): ITokens | null {
    const idToken = sessionStorage.getItem("idToken");
    const accessToken = sessionStorage.getItem("accessToken");

    return idToken && accessToken ? {AccessToken: accessToken, IdToken: idToken} : null;
  }

  login(payload: IUserAuthenticate): Observable<ITokens> {
    return this.http.post<ITokens>("api/auth/login", payload);
  }
}
