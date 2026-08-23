import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { APIService } from "@services/api";
import { AuthService } from "@services/auth";
import { Binary } from "@app/file/types/override";
import { File, FileID } from "@app/file/types/models";

@Service()
export class FileService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Uploads a binary file to the server.
   * 
   * @returns An Observable of a File object.
   */
  public upload(binary: Binary): Observable<File> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    const formData = new FormData();
    formData.append('file', binary);

    return this.http.post<File>(
      `${this.apiUrl}/files/upload`,
      formData,
      { headers }
    );
  }

  public download(id: FileID): Observable<Blob> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get(
      `${this.apiUrl}/files/${id}/download`,
      { headers, responseType: 'blob' }
    );
  }
}