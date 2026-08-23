import type { DocumentType } from '@app/document-type/types/models';
import type { File } from '@app/file/types/models';

export type DocumentID = string;
export type Title = string;

export type NewDocument = Omit<Document, "id">;

export interface Document {
  id: DocumentID;
  title: Title;
  type: DocumentType;
  file: File;
}
