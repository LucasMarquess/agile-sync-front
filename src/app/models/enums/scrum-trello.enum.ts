export enum ScrumTrelloEnum {
  SPRINTS = 'Sprints',
  BACKLOG = 'Backlog',
  DESENVOLVIMENTO = 'Desenvolvimento',
  TESTES = 'Teste',
  PRONTO = 'Pronto',
}

export function getScrumTrelloArray(): string[] {
  return Object.values(ScrumTrelloEnum);
}

export function getScrumTrelloEnumByDescription(
  description: string
): ScrumTrelloEnum | undefined {
  switch (description) {
    case 'Sprints':
      return ScrumTrelloEnum.SPRINTS;
    case 'Backlog':
      return ScrumTrelloEnum.BACKLOG;
    case 'Desenvolvimento':
      return ScrumTrelloEnum.DESENVOLVIMENTO;
    case 'Teste':
      return ScrumTrelloEnum.TESTES;
    case 'Pronto':
      return ScrumTrelloEnum.PRONTO;
    default:
      return undefined;
  }
}
