import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel, Subject} from '@microsoft/signalr';
import {environment} from "../../environments/environment";
import {IMessage} from "../models/Dto/Message/IMessage";
import {IOpenChat} from "../models/Dto/Chat/IOpenChat";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _hubConnection: HubConnection | undefined;
  private _hubEndpoint: string;

  public ConnectedSubj = new Subject<boolean>();

  constructor() {
    this._hubEndpoint = `${environment.backendUrl}/hub`;
    this.init();
  }

  public async createServer(): Promise<void> {
    console.log("starting connection");

    this.registerServerEvents();
  }

  private async init() {
    this._hubConnection = new HubConnectionBuilder().withUrl("https://localhost:5001/hub")
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
    if (!this._hubConnection || this._hubConnection.state !== "Connected")
      return console.error("Can't register server events cause connection not started");

    this._hubConnection.on("chats", (chats: IOpenChat[]) => {
      console.log("open chats");
      console.log(chats);
    })
  }

  public isConnected(): boolean {
    return this._hubConnection ? this._hubConnection?.state === "Connected" : false;
  }

  public async newSession(idToken: string): Promise<void> {
    await this._hubConnection?.invoke("NewSession", idToken);
  }

  public async sendMessage(message: IMessage): Promise<void> {
    await this._hubConnection?.invoke("message", message);
  }
}
