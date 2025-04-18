import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MetricsModel } from 'src/app/models/metrics.model';
import { TrelloBoardModel } from 'src/app/models/trello-board.model';
import { TrelloLabelModel } from 'src/app/models/trello-label.model';
import { TrelloListModel } from 'src/app/models/trello-list.model';
import { TrelloMappingModel } from 'src/app/models/trello-mapping.model';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
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

  getListsByBoard(boardId: string): Observable<TrelloListModel[]> {
    return this.http.get<TrelloListModel[]>(`${this.baseUrl}/${boardId}/lists`);
  }

  saveMappings(mappings: TrelloMappingModel[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/mappings`, mappings);
  }

  getMappingsBySettingId(settingId: number): Observable<TrelloMappingModel[]> {
    return this.http.get<TrelloMappingModel[]>(
      `${this.baseUrl}/${settingId}/mappings`
    );
  }

  save(model: TrelloSettingsModel): Observable<TrelloSettingsModel> {
    return this.http.post<TrelloSettingsModel>(`${this.baseUrl}/save`, model);
  }

  getById(): Observable<TrelloSettingsModel> {
    return this.http.get<TrelloSettingsModel>(`${this.baseUrl}`);
  }

  getLabelsByUser(): Observable<TrelloLabelModel[]> {
    return this.http.get<TrelloLabelModel[]>(`${this.baseUrl}/labels`);
  }

  getMetricsByFilter(
    initialPeriod: string,
    finalPeriod: string
  ): Observable<MetricsModel> {
    return this.http.get<MetricsModel>(
      `${this.baseUrl}/metrics?initialPeriod=${initialPeriod}&finalPeriod=${finalPeriod}`
    );
  }
}
