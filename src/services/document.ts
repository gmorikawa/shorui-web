import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { NewDocument, Document } from "@app/document/types/models";
import { APIService, AuthService } from "@services";
import { Folder } from "@app/folder/types/model";
import { File } from "@app/file/types/models";

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

    return this.http.get<Document[]>(
      `${this.apiUrl}/documents/folder/${folder.id}`,
      { headers }
    );
  }

  public create(newDocument: NewDocument, folder: Folder, file: File): Observable<Document> {
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
        file_id: file.id,
        folder_id: folder.id,
      },
      { headers }
    );
  }

  public download(document: Document): Observable<Blob> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get(
      `${this.apiUrl}/documents/${document.id}/download`,
      { headers, responseType: 'blob' }
    );
  }
}