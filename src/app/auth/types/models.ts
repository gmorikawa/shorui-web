import { Email } from "@app/user/types/types";

export type PlainPassword = string;
export type AuthToken = string;

export interface Credentials {
  email: Email;
  password: PlainPassword;
}
