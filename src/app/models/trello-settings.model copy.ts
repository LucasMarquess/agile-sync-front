export class TrelloBoardModel {
  id!: number;
  name!: string;

  constructor(init: Partial<TrelloBoardModel>) {
    Object.assign(this, init);
  }
}
