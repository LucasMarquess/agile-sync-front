export class TrelloListModel {
  id!: string;
  name!: string;

  constructor(init: Partial<TrelloListModel>) {
    Object.assign(this, init);
  }
}
