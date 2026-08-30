import { User } from "@app/user/types/types";

export type FolderID = string;
export type NewFolder = Omit<Folder, 'id' | 'user'>;

export interface Folder {
  id: FolderID;
  name: string;
  user: User;
}
