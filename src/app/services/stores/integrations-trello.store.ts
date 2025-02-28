import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
import { TrelloBoardModel } from 'src/app/models/trello-settings.model copy';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrelloIntegrationStore {
  private readonly http = inject(HttpClient);
  baseUrl = '';

  constructor() {
    this.baseUrl = environment.apiUrl + '/integration/trello';
  }

  getBoardsUser(): Observable<TrelloBoardModel[]> {
    return this.http.get<TrelloBoardModel[]>(`${this.baseUrl}/boards`);
  }
}
 