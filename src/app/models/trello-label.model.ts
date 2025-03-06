export class TrelloLabelModel {
  id!: string;
  name!: string;

  constructor(init: Partial<TrelloLabelModel>) {
    Object.assign(this, init);
  }
}
