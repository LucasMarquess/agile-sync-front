import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSyncComponent } from './settings-sync.component';

describe('SettingsSyncComponent', () => {
  let component: SettingsSyncComponent;
  let fixture: ComponentFixture<SettingsSyncComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSyncComponent]
    });
    fixture = TestBed.createComponent(SettingsSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
