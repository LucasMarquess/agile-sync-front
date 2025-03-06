import { ScrumTrelloEnum } from './enums/scrum-trello.enum';

export class CfdDataModel {
  stage!: ScrumTrelloEnum;
  quantityTotal!: number;
  quantityCards!: number;
}
