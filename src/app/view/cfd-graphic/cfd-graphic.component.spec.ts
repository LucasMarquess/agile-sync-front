import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfdGraphicComponent } from './cfd-graphic.component';

describe('CfdGraphicComponent', () => {
  let component: CfdGraphicComponent;
  let fixture: ComponentFixture<CfdGraphicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CfdGraphicComponent]
    });
    fixture = TestBed.createComponent(CfdGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
