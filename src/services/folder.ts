import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { APIService, AuthService } from "@services";
import { Folder, FolderID } from "@app/folder/types/model";
import { CacheService } from "./cache";

@Service()
export class FolderService extends APIService {
  private readonly auth = inject(AuthService);
  private readonly cache = inject(CacheService);

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

  /**
   * Saves a folder in the cache.
   *
   * @param folder The folder to be cached.
   */
  public saveInCache(folder: Folder): void {
    this.cache.setItem<Folder>(`folder:${folder.id}`, folder);
  }

  /**
   * Removes a folder from the cache.
   *
   * @param id The ID of the folder to be removed from the cache.
   */
  public removeFromCache(id: FolderID): void {
    this.cache.removeItem(`folder:${id}`);
  }

  /**
   * Fetches a folder by its ID, first checking the cache.
   *
   * @param id The ID of the folder to fetch.
   * @returns An Observable of the Folder object.
   */
  public getById(id: FolderID): Observable<Folder> {
    const cachedFolder = this.cache.getItem<Folder>(`folder:${id}`);
    if (cachedFolder) {
      return new Observable<Folder>((subscriber) => {
        subscriber.next(cachedFolder);
        subscriber.complete();
      });
    }

    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<Folder>(
      `${this.apiUrl}/folders/${id}`,
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