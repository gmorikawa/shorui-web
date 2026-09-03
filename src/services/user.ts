import { Observable } from 'rxjs';
import { inject, Service } from '@angular/core';

import { EditUser, NewUser, User, UserID } from '@app/user/types/types';
import { APIService, AuthService } from '@services';

@Service()
export class UserService extends APIService {
  private readonly auth = inject(AuthService);

  /**
   * Fetches all users.
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

  /**
   * Fetches a user by ID.
   * 
   * @param id The ID of the user to fetch.
   * @returns An Observable of the User object.
   */
  public getById(id: UserID): Observable<User> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.get<User>(
      `${this.apiUrl}/users/${id}`,
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

  public update(id: UserID, updatedUser: EditUser): Observable<User> {
    const headers = {
      Authorization: this.auth.getBearerToken(),
    };

    return this.http.put<User>(
      `${this.apiUrl}/users/${id}`,
      updatedUser,
      { headers }
    );
  }
}