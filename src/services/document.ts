import { Observable } from 'rxjs';
import { inject, Service } from '@angular/core';

import { Document, DocumentID, EditDocument, NewDocument } from '@app/document/types/models';
import { APIService, AuthService } from '@services';
import { Folder } from '@app/folder/types/models';
import { File } from '@app/file/types/models';

@Service()
export class DocumentService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches all documents from the API.
   *
   * @returns An Observable of an array of Document objects.
   */
  public getByFolder(folder: Folder): Observable<Document[]> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<Document[]>(`${this.apiUrl}/documents/folder/${folder.id}`, { headers });
  }

  public getById(id: DocumentID): Observable<Document> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<Document>(`${this.apiUrl}/documents/${id}`, { headers });
  }

  public create(newDocument: NewDocument): Observable<Document> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.post<Document>(
      `${this.apiUrl}/documents`,
      {
        title: newDocument.title,
        description: newDocument.description,
        type_id: newDocument.type.id,
        attributes: newDocument.attributes,
        file_id: newDocument.file.id,
        folder_id: newDocument.folder.id,
      },
      { headers },
    );
  }

  public update(id: DocumentID, updatedDocument: EditDocument): Observable<Document> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.put<Document>(
      `${this.apiUrl}/documents/${id}`,
      {
        title: updatedDocument.title,
        description: updatedDocument.description,
        type_id: updatedDocument.type.id,
        attributes: updatedDocument.attributes,
        file_id: updatedDocument.file?.id,
        folder_id: updatedDocument.folder.id,
      },
      { headers },
    );
  }

  public delete(id: DocumentID): Observable<void> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.delete<void>(`${this.apiUrl}/documents/${id}`, { headers });
  }

  public download(document: Document): Observable<Blob> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get(`${this.apiUrl}/documents/${document.id}/download`, {
      headers,
      responseType: 'blob',
    });
  }
}
