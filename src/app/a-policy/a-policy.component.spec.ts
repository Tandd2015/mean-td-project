import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APolicyComponent } from './a-policy.component';

describe('APolicyComponent', () => {
  let component: APolicyComponent;
  let fixture: ComponentFixture<APolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ APolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(APolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
