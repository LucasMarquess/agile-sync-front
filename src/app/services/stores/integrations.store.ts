import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrelloBoardModel } from 'src/app/models/trello-board.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsStore {
  private readonly http = inject(HttpClient);
  baseUrl = '';

  constructor() {
    this.baseUrl = environment.apiUrl + '/integrations';
  }

  getCheckHasIntegration(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check`);
  }
}
