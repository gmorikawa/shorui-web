import { Email } from "./user";

export type PlainPassword = string;
export type AuthToken = string;

export interface Credentials {
  email: Email;
  password: PlainPassword;
}
