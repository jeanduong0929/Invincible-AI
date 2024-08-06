import { User } from "./user";

export interface Experience {
  id: number;
  name: string;
  users: User[];
}
