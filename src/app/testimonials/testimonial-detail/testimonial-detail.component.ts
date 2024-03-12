import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ReviewApp } from '../../models';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-testimonial-detail',
  templateUrl: './testimonial-detail.component.html',
  styleUrls: ['./testimonial-detail.component.css']
})
export class TestimonialDetailComponent implements OnInit, OnDestroy {
  public selectedReviewEditErrors: string[] = [];
  public reviewOnSESubscription: Subscription = new Subscription();
  public reviewOnSEDSubscription: Subscription = new Subscription();
  public reviewsOnSESubscription: Subscription = new Subscription();
  public reviewOnSE: ReviewApp = new ReviewApp();
  public reviewsOnSE: Array<ReviewApp> = [];
  public reviewRatingFour: number = 0;
  public readonlyFour: boolean = true;
  public maxFour: number = 5;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly reviewService: ReviewService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.reviewOnSESubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.reviewService.getReview(id as string)),
      )
      .subscribe({
        next: (reviewAppDetail) => {
          this.reviewOnSE = reviewAppDetail;
          console.log(this.route, 'Start', this.reviewOnSE);
        },
        error: (error) => this.handleReviewOnSEErrors(error.error.message)
      });

    this.reviewsOnSESubscription = this.reviewService.getSiteReviews()
      .subscribe({
        next: (detailReviewsApp) => {
          this.reviewsOnSE = detailReviewsApp;
        },
        error: (error) => this.handleReviewOnSEErrors(error.error)
      });
  }


  public onEventOnSE(event: Event): void {
    console.log('Preventing Event default Propagation');
    event.stopPropagation();
  }

  public onDeleteOnSE(reviewOnSEOnSite: ReviewApp): void {
    this.reviewOnSEDSubscription = this.reviewService.removeReview(reviewOnSEOnSite._id)
      .subscribe({
        next: (dEReview) => {
          console.log('Deleted Review ', dEReview);
          this.reviewsOnSE = this.reviewsOnSE.filter(
            dEReview => dEReview._id !== reviewOnSEOnSite._id,
          );
          this.router.navigateByUrl('admin/dash');
        },
        error: (error) => this.handleReviewOnSEErrors(error.error),
      });
  }

  private handleReviewOnSEErrors(errors: string[] | string): void {
    this.selectedReviewEditErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.reviewOnSESubscription.unsubscribe();
    this.reviewOnSEDSubscription.unsubscribe();
    this.reviewsOnSESubscription.unsubscribe();
  }

}
