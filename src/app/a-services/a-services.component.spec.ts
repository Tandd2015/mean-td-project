import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AServicesComponent } from './a-services.component';

describe('AServicesComponent', () => {
  let component: AServicesComponent;
  let fixture: ComponentFixture<AServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
