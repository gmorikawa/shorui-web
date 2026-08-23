export type FileID = string;
export type Path = string;

export enum FileState {
  UPLOADING = "UPLOADING",
  AVAILABLE = "AVAILABLE",
  CORRUPTED = "CORRUPTED",
}

export interface File {
  id: FileID;
  path: Path;
  state: FileState;
}