import { Email } from "@features/user/types";

export type PlainPassword = string;
export type AuthToken = string;

export interface Credentials {
  email: Email;
  password: PlainPassword;
}
