import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSyncTrelloComponent } from './settings-sync-trello.component';

describe('SettingsSyncTrelloComponent', () => {
  let component: SettingsSyncTrelloComponent;
  let fixture: ComponentFixture<SettingsSyncTrelloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSyncTrelloComponent],
    });
    fixture = TestBed.createComponent(SettingsSyncTrelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
