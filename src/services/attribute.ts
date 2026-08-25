import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { NewAttribute, Attribute } from "@app/attribute/types/models";
import { APIService, AuthService } from "@services";

@Service()
export class AttributeService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches all attributes from the API.
   * 
   * @returns An Observable of an array of Attribute objects.
   */
  public getAll(): Observable<Attribute[]> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<Attribute[]>(
      `${this.apiUrl}/attributes`,
      { headers }
    );
  }

  public create(newAttribute: NewAttribute): Observable<Attribute> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.post<Attribute>(
      `${this.apiUrl}/attributes`,
      newAttribute,
      { headers }
    );
  }
}
