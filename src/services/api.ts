import { inject, Service } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";

@Service()
export abstract class APIService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl: string = environment.apiUrl;
}
