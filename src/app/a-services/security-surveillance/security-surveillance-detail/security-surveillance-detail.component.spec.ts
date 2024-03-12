import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySurveillanceDetailComponent } from './security-surveillance-detail.component';

describe('SecuritySurveillanceDetailComponent', () => {
  let component: SecuritySurveillanceDetailComponent;
  let fixture: ComponentFixture<SecuritySurveillanceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritySurveillanceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritySurveillanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
