import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, throwError } from 'rxjs';
import { SprintCfdDataModel } from 'src/app/models/sprint-cfd-data.model';
import { TrelloLabelModel } from 'src/app/models/trello-label.model';
import { WipModel } from 'src/app/models/wip.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TrelloIntegrationStore } from 'src/app/services/stores/integrations-trello.store';
import { ReportsStore } from 'src/app/services/stores/reports.store';
import { IntegrationsStore } from './../../services/stores/integrations.store';

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
  wipByStageData: WipModel[] = [];
  initialPeriod: string = '';
  finalPeriod: string = '';
  displayedColumns: string[] = [
    'sprintNumber',
    'cycleTime',
    'leadTime',
    'throughput',
  ];
  wipColumns: string[] = ['sprintNumber', 'stage', 'quantity'];
  velocity: number = 0;

  cfdDataSource = new MatTableDataSource<SprintCfdDataModel>();
  wipDataSource = new MatTableDataSource<WipModel>();

  @ViewChild('cfdPaginator') cfdPaginator!: MatPaginator;
  @ViewChild('wipPaginator') wipPaginator!: MatPaginator;

  constructor(
    private integrationsStore: IntegrationsStore,
    private trelloIntegrationStore: TrelloIntegrationStore,
    private reportsStore: ReportsStore,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getByIntegrationsByUser();
    });
    setTimeout(() => {
      this.cfdDataSource.paginator = this.cfdPaginator;
      this.wipDataSource.paginator = this.wipPaginator;
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
        this.cfdData = response.sprintCfdData;
        this.cfdDataSource.data = this.cfdData;
        this.velocity = response.velocity;
        this._formatData();

        setTimeout(() => {
          this.cfdDataSource.paginator = this.cfdPaginator;
          this.wipDataSource.paginator = this.wipPaginator;
        });
      });
  }

  private _formatData() {
    this.wipByStageData = this.cfdData.flatMap((data) =>
      data.wipsByStage.map((stage) => ({
        sprintNumber: data.sprintNumber,
        stage: stage.stage,
        quantity: stage.quantity,
      }))
    );

    this.wipDataSource.data = this.wipByStageData;
  }

  generatePDF() {
    if (!this.initialPeriod || !this.finalPeriod) {
      this.toastr.warning('Selecione um período antes de gerar o relatório.', 'Atenção!');
      return;
    }
  
    this.requestLoading = true;
    this.reportsStore
      .generateReportMetricsTrello(this.initialPeriod, this.finalPeriod)
      .pipe(
        catchError((err) => {
          this.toastr.error('Ocorreu um erro ao gerar o relatório.', 'Erro');
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe((blob) => {
        this.downloadFile(blob, 'relatorio-metricas.pdf');
        this.toastr.success('Relatório gerado com sucesso!', 'Sucesso');
      });
  }
  
  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
}
