import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-trello-sync',
  templateUrl: './settings-sync-trello.component.html',
  styleUrls: ['./settings-sync-trello.component.scss'],
})
export class SettingsSyncTrelloComponent {
  trelloKey: string = '';
  trelloToken: string = '';

  saveSettings() {}
}
