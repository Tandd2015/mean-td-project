import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySurveillanceListComponent } from './security-surveillance-list.component';

describe('SecuritySurveillanceListComponent', () => {
  let component: SecuritySurveillanceListComponent;
  let fixture: ComponentFixture<SecuritySurveillanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritySurveillanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritySurveillanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
