import { User } from "@app/user/types/types";

export type FolderID = string;

export interface Folder {
    id: FolderID;
    name: string;
    user: User;
}