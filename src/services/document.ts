import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { NewDocument, Document } from "@app/document/types/models";
import { APIService, AuthService } from "@services";
import { Folder } from "@app/folder/types/model";

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
        file_id: newDocument.file.id,
        attributes: newDocument.attributes,
      },
      { headers }
    );
  }
}