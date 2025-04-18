export class TrelloMappingModel {
  referent!: string;
  listId!: string;
  listName!: string;
  trelloSettingId!: number;

  constructor(init: Partial<TrelloMappingModel>) {
    Object.assign(this, init);
  }
}
