export class TrelloSettingsModel {
    id!: number;
    createdAt!: Date;
    updatedAt!: Date;
    token!: string;
    key!: string;
    cardMappingName!: string;
    boardId!: string;

    constructor(init: Partial<TrelloSettingsModel>) {
        Object.assign(this, init);
    }
}