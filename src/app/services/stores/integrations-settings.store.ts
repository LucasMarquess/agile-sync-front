import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsSettingsStore {
  private readonly http = inject(HttpClient);
  baseUrl = '';

  constructor() {
    this.baseUrl = environment.apiUrl + '/integrations-settings';
  }

  save(model: TrelloSettingsModel): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/save/trello`, model);
  }

  getById(): Observable<TrelloSettingsModel> {
    return this.http.get<TrelloSettingsModel>(`${this.baseUrl}/trello`);
  }
}
