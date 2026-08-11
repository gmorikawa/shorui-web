import { Observable, tap } from "rxjs";

import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthToken, Credentials } from "../features/auth";
import { NewAdmin } from "../features/user";
import { environment } from "../environments/environment";

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
}