import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsStore {
  private readonly http = inject(HttpClient);
  baseUrl = '';

  constructor() {
    this.baseUrl = environment.apiUrl + '/reports';
  }

  generateReportMetricsTrello(initialPeriod: string, finalPeriod: string): Observable<Blob> {
    const url = `${this.baseUrl}/metrics-trello?initialPeriod=${initialPeriod}&finalPeriod=${finalPeriod}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
