import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { APIService, AuthService } from "@services";
import { Folder } from "@app/folder/types/model";

@Service()
export class FolderService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches folder with common parent
   * 
   * @returns An Observable of an array of Folder objects.
   */
  public getByParent(parent: Folder | null): Observable<Folder[]> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<Folder[]>(
      `${this.apiUrl}/folders?parent_id=${parent?.id ?? ""}`,
      { headers }
    );
  }

  public create(name: string, parent: Folder): Observable<Folder> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.post<Folder>(
      `${this.apiUrl}/folders`,
      { name, parent_id: parent?.id ?? null },
      { headers }
    );
  }
}