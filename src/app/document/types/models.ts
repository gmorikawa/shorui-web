import { AttributeKey } from '@app/attribute/types/models';
import type { DocumentType } from '@app/document-type/types/models';
import type { File } from '@app/file/types/models';
import { Folder } from '@app/folder/types/model';
import { User } from '@app/user/types/types';

export type DocumentID = string;
export type Title = string;
export type Text = string;
export type DocumentAttributes = Record<AttributeKey, string>;

export type NewDocument = Omit<Document, "id" | "user" | "file">;

export interface Document {
  id: DocumentID;
  title: Title;
  description?: Text;
  type: DocumentType;
  file: File;
  attributes?: DocumentAttributes;
  user: User;
}
