import { User } from "./user";

export interface Gender {
  id: number;
  name: string;
  users: User[];
}
