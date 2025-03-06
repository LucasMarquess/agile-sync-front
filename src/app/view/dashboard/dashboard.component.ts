import { IntegrationsStore } from './../../services/stores/integrations.store';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, throwError } from 'rxjs';
import { SprintCfdDataModel } from 'src/app/models/sprint-cfd-data.model';
import { TrelloLabelModel } from 'src/app/models/trello-label.model';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
import { TrelloIntegrationStore } from 'src/app/services/stores/integrations-trello.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  hasSettingsIntegration: Boolean = true;
  requestLoading: Boolean = false;
  labels: TrelloLabelModel[] = [];
  cfdData: SprintCfdDataModel[] = [];
  selectedSprint!: SprintCfdDataModel;
  initialPeriod: string = '';
  finalPeriod: string = '';

  constructor(
    private integrationsStore: IntegrationsStore,
    private trelloIntegrationStore: TrelloIntegrationStore,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getByIntegrationsByUser();
    });
  }

  getByIntegrationsByUser() {
    this.requestLoading = true;
    this.integrationsStore
      .getCheckHasIntegration()
      .pipe(
        catchError((err) => {
          if (err?.error?.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar verificar se existe integrações ativas para o usuário.',
              'Erro'
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe((response) => {
        this.hasSettingsIntegration = response;
        if (response) {
          this.getLabelsByUser();
        }
      });
  }

  getLabelsByUser() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .getLabelsByUser()
      .pipe(
        catchError((err) => {
          if (err?.error?.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar buscar as labels do Trello.',
              'Erro'
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe((response) => {
        this.labels = response;
      });
  }

  validateSelection() {
    if (this.initialPeriod && this.finalPeriod) {
      const initialNumber = this.extractSprintNumber(this.initialPeriod);
      const finalNumber = this.extractSprintNumber(this.finalPeriod);

      if (initialNumber > finalNumber) {
        this.toastr.warning(
          'O período inicial não pode ser maior que o período final.',
          'Atenção!'
        );
        this.initialPeriod = '';
      }
    }
  }

  isInitialPeriodDisabled(item: TrelloLabelModel): boolean {
    if (!this.finalPeriod) return false;
    return (
      this.extractSprintNumber(item.name) >
      this.extractSprintNumber(this.finalPeriod)
    );
  }

  isFinalPeriodDisabled(item: TrelloLabelModel): boolean {
    if (!this.initialPeriod) return false;
    return (
      this.extractSprintNumber(item.name) <
      this.extractSprintNumber(this.initialPeriod)
    );
  }

  extractSprintNumber(label: string): number {
    const match = label.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  generateMetrics() {
    if (!this.initialPeriod || !this.finalPeriod) return;

    this.trelloIntegrationStore
      .getMetricsByFilter(this.initialPeriod, this.finalPeriod)
      .pipe(
        catchError((err) => {
          if (err?.error?.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar gerar as métricas.',
              'Erro'
            );
          }
          return throwError(() => err);
        })
      )
      .subscribe((response) => {
        this.cfdData = response;
        this.selectedSprint = null!;
      });
  }

  updateMetrics() {
    this.selectedSprint = this.cfdData.find(
      (sprint) => sprint.sprintNumber === this.selectedSprint.sprintNumber
    )!;
  }
}
