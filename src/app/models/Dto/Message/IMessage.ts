import {IUser} from "../User/IUser";

export interface IMessage {
  id: string
  amISender: boolean
  content: string
  sentDate: Date
}
