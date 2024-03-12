import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialNewComponent } from './testimonial-new.component';

describe('TestimonialNewComponent', () => {
  let component: TestimonialNewComponent;
  let fixture: ComponentFixture<TestimonialNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
