import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import {
  NewDocumentType,
  DocumentType,
  DocumentTypeID,
} from "@app/document-type/types/models";
import { APIService, AuthService } from "@services";

@Service()
export class DocumentTypeService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches all document types from the API.
   * 
   * @returns An Observable of an array of DocumentType objects.
   */
  public getAll(): Observable<DocumentType[]> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<DocumentType[]>(
      `${this.apiUrl}/document-types`,
      { headers }
    );
  }

  public getById(id: DocumentTypeID): Observable<DocumentType> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<DocumentType>(
      `${this.apiUrl}/document-types/${id}`,
      { headers }
    );
  }

  public create(newDocumentType: NewDocumentType): Observable<DocumentType> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.post<DocumentType>(
      `${this.apiUrl}/document-types`,
      this.normalizeAttributes(newDocumentType),
      { headers }
    );
  }

  public update(id: DocumentTypeID, documentType: DocumentType): Observable<DocumentType> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.put<DocumentType>(
      `${this.apiUrl}/document-types/${id}`,
      this.normalizeAttributes(documentType),
      { headers }
    );
  }

  private normalizeAttributes(documentType: DocumentType | NewDocumentType): any {
    return {
      ...documentType,
      attributes: documentType.attributes.map(attribute => attribute?.key ?? attribute),
    };
  }
}