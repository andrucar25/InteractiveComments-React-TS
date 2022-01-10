import { IUser } from "./IUser";

export interface IReply {
    id?: number;
    content: string;
    createdAt?: string | number;
    score: number;
    replyingTo: string;
    user:IUser;

  }
