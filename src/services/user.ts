import { Observable } from "rxjs";
import { inject, Service } from "@angular/core";

import { NewUser, User } from "@features/user/types";
import { APIService } from "@services/api";
import { AuthService } from "@services/auth";

@Service()
export class UserService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches all users from the API.
   * 
   * @returns An Observable of an array of User objects.
   */
  public getAll(): Observable<User[]> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<User[]>(
      `${this.apiUrl}/users`,
      { headers }
    );
  }

  public create(newUser: NewUser): Observable<User> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.post<User>(
      `${this.apiUrl}/users`,
      newUser,
      { headers }
    );
  }
}