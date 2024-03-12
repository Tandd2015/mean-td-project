import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Review } from '../../models';
import { ReviewService } from '../../services/review.service';


@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.css']
})
export class TestimonialListComponent implements OnInit, OnDestroy {
  public reviewsMixedListErrors: string[] = [];

  public reviewsGoogle: Array<Review> = [];
  @Output() reviewsGoogleEvent: EventEmitter<Array<Review>> = new EventEmitter<Array<Review>>();
  public reviewsGoogleSubscription: Subscription = new Subscription();
  public review: Review = new Review();
  public reviewRating: Array<number> = [];
  @Output() reviewRatingGoogleEvent: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  public reviewRatingTwo: Array<number> = [];
  public message: string = '';
  public readonly: boolean = true;
  public max: number = 5;

  public autoSlideReviewStopperGoogle: boolean = true;
  @Output() autoSlideReviewStopperGoogleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly reviewService: ReviewService,
  ) { };

  ngOnInit(): void {
    this.onGetGoogleReviews();
  };

  private handleReviewErrors(errors: string[] | string): void {
    this.reviewsMixedListErrors = Array.isArray(errors) ? errors : [errors];
  };

  public onGetGoogleReviews(): void {
    this.reviewsGoogleSubscription = this.reviewService.getGoogleReviews()
      .subscribe({
        next: (reviewsGoogle) => {
          reviewsGoogle.forEach((reviews, index) => {
            if(reviews.oRDate) {
              let slicedORDate = reviews.oRDate.slice(23, reviews.oRDate.length);
              reviews.oRDate = slicedORDate;
            };
            if (reviews.likes?.toString()  === 'Like') {
              reviews.likes = 0;
            };
            this.reviewRating[index] = reviews.byRating as number;
            this.reviewsGoogle.push(reviews);
          });
          if (this.reviewsGoogle.length === 0) {
            this.reviewsGoogleSubscription.unsubscribe();
            this.onGetGoogleReviews();
          };
          this.reviewsGoogleEvent.emit(this.reviewsGoogle);
          this.reviewRatingGoogleEvent.emit(this.reviewRating);
        },
        error: (error) => {
          this.handleReviewErrors(error.error);
        },
      });
  };

  public stopAutoSlideReviewGoogle(): void {
    this.autoSlideReviewStopperGoogle = false;
  };

  public startAutoSlideReviewGoogle(): void {
    this.autoSlideReviewStopperGoogle = true;
  };

  ngOnDestroy(): void {
    this.reviewsGoogleEvent.unsubscribe();
    this.reviewRatingGoogleEvent.unsubscribe();
    this.reviewsGoogleSubscription.unsubscribe();
  };
};
