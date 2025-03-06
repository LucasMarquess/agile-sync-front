import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SprintCfdDataModel } from 'src/app/models/sprint-cfd-data.model';

@Component({
  selector: 'app-cfd-graphic',
  templateUrl: './cfd-graphic.component.html',
  styleUrls: ['./cfd-graphic.component.scss'],
})
export class CfdGraphicComponent implements OnInit, OnChanges {
  @Input() cfdData: SprintCfdDataModel[] = [];

  private chart: Chart | undefined;

  constructor() {}

  ngOnInit() {
    Chart.register(...registerables);
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cfdData'] && this.chart) {
      this.updateChart();
    }
  }

  private createChart() {
    const ctx = document.getElementById('cfd') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sprints',
              font: { weight: 'bold' },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Histórias de usuário',
              font: { weight: 'bold' },
            },
            stacked: true,
          },
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    this.chart.data = this.getChartData();
    this.chart.update();
  }

  private getChartData() {
    const colors = {
      green: { fill: '#c2e5cb', stroke: '#34a853' },
      blue: { fill: '#c6dafc', stroke: '#4285f4' },
      yellow: { fill: '#feebb3', stroke: '#fbbc04' },
      red: { fill: '#f9c6c2', stroke: '#ea4335' },
    };

    const labels = this.cfdData.map(
      (sprint) => 'Sprint ' + sprint.sprintNumber
    );
    const backlogData = this.extractStageData('Backlog');
    const desenvolvimentoData = this.extractStageData('Desenvolvimento');
    const testeData = this.extractStageData('Teste');
    const prontoData = this.extractStageData('Pronto');

    return {
      labels,
      datasets: [
        {
          label: 'Pronto',
          fill: true,
          backgroundColor: colors.green.fill,
          borderColor: colors.green.stroke,
          data: prontoData,
          stack: 'Stack 0',
        },
        {
          label: 'Teste',
          fill: true,
          backgroundColor: colors.blue.fill,
          borderColor: colors.blue.stroke,
          data: testeData,
          stack: 'Stack 0',
        },
        {
          label: 'Desenvolvimento',
          fill: true,
          backgroundColor: colors.yellow.fill,
          borderColor: colors.yellow.stroke,
          data: desenvolvimentoData,
          stack: 'Stack 0',
        },
        {
          label: 'Backlog',
          fill: true,
          backgroundColor: colors.red.fill,
          borderColor: colors.red.stroke,
          data: backlogData,
          stack: 'Stack 0',
        },
      ],
    };
  }

  private extractStageData(stageName: string): number[] {
    return this.cfdData.map(
      (sprint) =>
        sprint.cfdDatas.find((data) => data.stage === stageName)
          ?.quantityTotal || 0
    );
  }
}
