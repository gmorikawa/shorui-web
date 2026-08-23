import { Observable, tap } from "rxjs";

import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthToken, Credentials } from "@app/auth/types/models";
import { NewAdmin, NewUser } from "@app/user/types/types";
import { environment } from "@environments/environment";
import { MissingAuthTokenException } from "@app/auth/types/exceptions";

export interface LoginResponse {
  token: AuthToken;
}

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = environment.apiUrl;

  public firstAccess(admin: NewAdmin): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/first-access`, admin);
  }

  public registerUser(user: NewUser): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, user);
  }

  /**
   * Logs in a user with the provided credentials.
   * 
   * After the login request is successful, the auth token is stored in local storage for future authenticated requests.
   * 
   * @param credentials The user's email and password.
   * @returns An observable that emits the login response containing the auth token.
   */
  public login(credentials: Credentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem("authToken", response.token);
        })
      );
  }

  /**
   * Retrieves the Bearer token from local storage for authenticated requests.
   * 
   * @throws {MissingAuthTokenException} If no auth token is found in local storage.
   * @returns The Bearer token string.
   */
  public getBearerToken(): string {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new MissingAuthTokenException();
    }
    return `Bearer ${localStorage.getItem("authToken")}`;
  }
}