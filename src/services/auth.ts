import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthToken, Credentials } from "../features/auth";
import { Observable } from "rxjs";

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  public login(credentials: Credentials): Observable<AuthToken> {
    return this.http.post<AuthToken>("/api/auth/login", credentials);
  }
}