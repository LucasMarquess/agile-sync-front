import { Component } from "@angular/core";

@Component({
  selector: 'documentation-modal',
  templateUrl: './documentation.modal.html',
  styleUrls: ['./documentation.modal.scss'],
})
export class DocumentationModalComponent {
    patterns = [
      {
        title: 'Diferença no Gradiente',
        description: 'Ocorre quando as tarefas entram no fluxo mais rápido do que são concluídas, aumentando o WIP e os tempos de ciclo. Recomenda-se limitar o WIP e evitar multitarefas.'
      },
      {
        title: 'Linhas Planas',
        description: 'Indicam períodos de inatividade. Para evitar isso, é essencial estabelecer limites de WIP e monitorar itens bloqueados.'
      },
      {
        title: 'Curva-S',
        description: 'A produtividade é mais alta no meio da sprint, enquanto o início e o fim apresentam menor atividade. Distribuir melhor o trabalho ao longo de toda a sprint ajuda a manter um fluxo estável.'
      },
      {
        title: 'Espaçamentos Protuberantes',
        description: 'O WIP cresce desproporcionalmente à capacidade da equipe, resultando em atrasos. A solução envolve separar tarefas ativas e inativas.'
      },
      {
        title: 'Degraus da Escada',
        description: 'A entrega de tarefas ocorre em lotes. Para evitar atrasos e retrabalho, recomenda-se entregar as tarefas assim que estiverem prontas.'
      },
      {
        title: 'Espaçamentos Desaparecendo',
        description: 'Um estado do processo não aparece no CFD porque as tarefas estão pulando esse estágio. Para corrigir, é necessário revisar o fluxo e usar estados de fila para identificar bloqueios ocultos.'
      }
    ];
  }