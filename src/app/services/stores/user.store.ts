import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationModel } from "src/app/models/authentication.model";
import { LoginResponse } from "src/app/models/login-response.model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly http = inject(HttpClient);
  baseUrl = '';

  constructor() {
    this.baseUrl = environment.apiUrl;
  }

  login(model: AuthenticationModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, model);
  }
}