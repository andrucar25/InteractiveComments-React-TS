import { IUser } from "./IUser";
import { IReply } from "./IReply";

export interface IComment {
    id?: number;
    content: string;
    createdAt?: string | number;
    score: number;
    user:IUser;
    replies:Array<IReply>;
  }

