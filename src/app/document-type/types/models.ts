export type DocumentTypeID = string;
export type UniqueName = string;
export type Text = string;

export type NewDocumentType = Omit<DocumentType, "id">;

export interface DocumentType {
  id: DocumentTypeID;
  name: UniqueName;
  description: Text;
}
