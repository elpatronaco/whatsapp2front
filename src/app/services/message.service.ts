import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';
import {environment} from "../../environments/environment";
import {IMessage} from "../models/Dto/Message/IMessage";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";
import {IUser} from "../models/Dto/User/IUser";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _hubConnection: HubConnection | undefined;

  public ConnectedSubj = new Subject<boolean>();
  public OpenChatsSubj = new Subject<IOpenChat[]>();

  public async init() {
    this._hubConnection = new HubConnectionBuilder().withUrl(`${environment.backendUrl}/hub`)
      .configureLogging(LogLevel.Information).withAutomaticReconnect()
      .build();

    await this.connectServer();

    this.registerServerEvents();

    this.ConnectedSubj.next(this.isConnected());
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
      console.log("event: ", chats);
      this.OpenChatsSubj.next(chats);
    })

    this._hubConnection?.on("Messages", (messages: IMessage[]) => {
      console.log("messages received");
      console.log(messages);
    })
  }

  public isConnected(): boolean {
    return this._hubConnection ? this._hubConnection.state === "Connected" : false;
  }

  public async newSession(idToken: string): Promise<void> {
    await this._hubConnection?.invoke("NewSession", idToken);
  }

  public async sendMessage(message: IMessage): Promise<void> {
    await this._hubConnection?.invoke("message", message);
  }

  public async openChat(recipient: IUser) {
    await this._hubConnection?.invoke("OpenChat", recipient.Id);
  }
}
