import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, JsonHubProtocol, LogLevel} from '@microsoft/signalr';
import {environment} from "../../environments/environment";
import {IMessage} from "../models/Dto/Message/IMessage";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";
import {IUser} from "../models/Dto/User/IUser";
import {BehaviorSubject, Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private authService: AuthService) {
  }

  private _hubConnection: HubConnection | undefined;

  public ConnectedSubj = new BehaviorSubject<boolean>(false);
  public OpenChatsSubj = new BehaviorSubject<IOpenChat[]>([]);
  public MessagesSubj = new BehaviorSubject<IMessage[]>([]);
  public NewMessageSubj = new Subject<IMessage>();

  public async init() {
    this._hubConnection = new HubConnectionBuilder().withUrl(`${environment.backendUrl}/hub`)
      .configureLogging(LogLevel.Information).withAutomaticReconnect()
      .build();

    await this.connectServer();

    this.registerServerEvents();

    this.ConnectedSubj.next(this.isConnected());

    if (this.isConnected()) {
      const tokens = this.authService.getTokens();

      if (tokens) await this.newSession(tokens.idToken);
    }
  }

  private async connectServer(): Promise<void> {
    if (!this._hubConnection || this._hubConnection.state === HubConnectionState.Connected) return;

    try {
      await this._hubConnection.start();
    } finally {
      this.ConnectedSubj.next(this.isConnected());
    }
  }

  private registerServerEvents(): void {
    if (!this.isConnected())
      return console.error("Can't register server events cause connection not started");

    this._hubConnection?.on("Chats", (chats: IOpenChat[]) => {
      this.OpenChatsSubj.next(chats);
    });

    this._hubConnection?.on("Messages", (messages: IMessage[]) => {
      this.MessagesSubj.next(messages);
    });

    this._hubConnection?.on("New Message", (newMessage: IMessage) => {
      this.NewMessageSubj.next(newMessage);
    });
  }

  public isConnected(): boolean {
    return this._hubConnection ? this._hubConnection.state === "Connected" : false;
  }

  public async newSession(idToken: string): Promise<void> {
    await this._hubConnection?.invoke("NewSession", idToken);
  }

  public async sendMessage(message: string, recipientId: string): Promise<void> {
    await this._hubConnection?.invoke("SendMessage", message, recipientId);
  }

  public async openChat(recipient: IUser) {
    await this._hubConnection?.invoke("OpenChat", recipient.id);
  }
}
