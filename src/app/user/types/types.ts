import { PlainPassword } from "@app/auth/types/models";

export type UserID = string;
export type FullName = string;
export type Email = string;

export type NewUser = Omit<User, "id"> & { password: PlainPassword };
export type NewAdmin = Omit<User, "id" | "role"> & { password: PlainPassword };

export interface User {
  id: UserID;
  name: FullName;
  email: Email;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}