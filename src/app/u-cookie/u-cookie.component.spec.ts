import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UCookieComponent } from './u-cookie.component';

describe('UCookieComponent', () => {
  let component: UCookieComponent;
  let fixture: ComponentFixture<UCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UCookieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
