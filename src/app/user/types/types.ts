import { PlainPassword } from "@app/auth/types/models";
import { Folder } from "@app/folder/types/model";

export type UserID = string;
export type FullName = string;
export type Email = string;

export type NewUser = Omit<User, "id" | "folder"> & { password: PlainPassword };
export type NewAdmin = Omit<User, "id" | "role" | "folder"> & { password: PlainPassword };

export interface User {
  id: UserID;
  name: FullName;
  email: Email;
  role: UserRole;
  folder: Folder;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}