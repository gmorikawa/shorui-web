export type PlainPassword = string;
export type Username = string;
export type AuthToken = string;

export interface Credentials {
  username: Username;
  password: PlainPassword;
}
