import { CfdDataModel } from './cfd-data.model';
import { WipModel } from './wip.model';

export class SprintCfdDataModel {
  sprintNumber!: number;
  cfdDatas!: CfdDataModel[];
  wipsByStage!: WipModel[];
  throughput!: number;
  leadTime!: number;
  cycleTime!: number;
}
