import { ScrumTrelloEnum } from './enums/scrum-trello.enum';

export class WipModel {
  stage!: ScrumTrelloEnum;
  quantity!: number;
}
