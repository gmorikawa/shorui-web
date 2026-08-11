import { inject, Service } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthToken, Credentials } from "../features/auth";
import { Observable } from "rxjs";
import { NewAdmin } from "../features/user";
import { environment } from "../environments/environment";

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = environment.apiUrl;

  public firstAccess(admin: NewAdmin): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/first-access`, admin);
  }

  public login(credentials: Credentials): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.apiUrl}/auth/login`, credentials);
  }
}