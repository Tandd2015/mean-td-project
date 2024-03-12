import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ReviewService } from '../../services';
import { ReviewApp } from '../../models';


@Component({
  selector: 'app-testimonial-new',
  templateUrl: './testimonial-new.component.html',
  styleUrls: ['./testimonial-new.component.css']
})
export class TestimonialNewComponent implements OnInit, OnDestroy {

  public newReviewsAppSubscription: Subscription = new Subscription();
  public newReviewAppSubscription: Subscription = new Subscription();
  public newReviewAppForm!: FormGroup;
  public newReviewAppEnd: ReviewApp = new ReviewApp();
  public newReviewsAppEnd: Array<ReviewApp> = [];
  public newSelectedFile!: File;
  public newFile!: File;
  public newPickedImage: any = '';
  public newReviewErrors: string[] = [];
  public newReadonly: boolean = false;
  public newMax: number = 5;

  constructor(
    private readonly router: Router,
    private readonly reviewService: ReviewService,
    private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.newReviewsAppSubscription = this.reviewService.getSiteReviews().subscribe({
      next: (newReviewsApp) => {
        this.newReviewsAppEnd = newReviewsApp;
      },
      error: (error) => this.handleNewReviewErrors(error.error)
    });

    this.newReviewAppForm = this.formBuilder.group({
      content: [null, [Validators.required, Validators.minLength(1)]],
      writtenBy: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(360)]],
      byImage: [null, [Validators.required]],
      byRating: [null, [Validators.required, Validators.max(5)]]
    });
  }

  onNewPickedImage(event: Event): void {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement)!.files![0];
    this.newSelectedFile = file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newPickedImage = reader.result as string;
    };
  }

  onNewReviewSubmit(): void {
    console.log(this.newReviewAppForm, this.newReviewAppForm.value)
    this.newReviewAppEnd = this.newReviewAppForm.value;
    this.newReviewAppSubscription = this.reviewService.createReview(this.newReviewAppEnd, this.newSelectedFile).subscribe({
      next: (newReviewApp) => {
        this.newReviewsAppEnd = [...this.newReviewsAppEnd, newReviewApp];
        console.log('Submitted a New Review.', newReviewApp, this.newReviewAppEnd, this.newReviewsAppEnd);
        this.newReviewAppForm.reset();
        this.router.navigateByUrl('/home/dash');
      },
      error: (error) => {
        this.handleNewReviewErrors(error.error);
      }
    });
  }

  private handleNewReviewErrors(errors: string[] | string): void {
    this.newReviewErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.newReviewsAppSubscription.unsubscribe();
    this.newReviewAppSubscription.unsubscribe();
  }
}
