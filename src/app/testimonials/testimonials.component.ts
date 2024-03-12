import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReviewApp } from '../models';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  public reviewsOnSListErrors: string[] = [];
  public reviewsOnSiSubscription: Subscription = new Subscription();
  public reviewsOnSiDSubscription: Subscription = new Subscription();
  public reviewsOnSi: Array<ReviewApp> = [];
  public selectedReviewOnS: any = null;

  public reviewRatingThree: Array<number> = [];
  public readonlyThree: boolean = true;
  public maxThree: number = 5;

  public message: string = '';

  constructor(
    private readonly reviewService: ReviewService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.reviewsOnSiSubscription = this.reviewService.getSiteReviews()
      .subscribe({
        next: (siteR) => {
          siteR.forEach((reviewsOnS, idxOnS) => {
            this.reviewRatingThree[idxOnS] = reviewsOnS.byRating as number;
            reviewsOnS.oRDate = (reviewsOnS.oRDate === null) ? 'Terry Dockery Investigations and Security Services has not yet responded to customer review.' : reviewsOnS.oRDate;
          });
          this.reviewsOnSi = siteR;
        },
        error: (error) => this.handleReviewOnSErrors(error.error),
      });
  }

  public onGetSiteReviewsOnS(): void {
    this.reviewService.getSiteReviews()
      .subscribe({
        next: (reviewsOnSiteOns) => {
          reviewsOnSiteOns.forEach((reviewsOnS, idxOnS, arrOnS) => {
            reviewsOnS.createdAt?.slice(0,10).split('-').forEach((createdAtItem, indexOnS, arrayOnS) => {
              if(indexOnS === 2) {
                reviewsOnS.createdAt = `${arrayOnS[1]}-${arrayOnS[2]}-${arrayOnS[0]}`;
              }
            });
            this.reviewsOnSi.push(reviewsOnS);
          })
        },
        error: (error) => this.handleReviewOnSErrors(error.error),
      });
  }

  public onSelectReviewOnS(reviewOnSOnSite: ReviewApp): void {
    console.log('Selecting a Review', reviewOnSOnSite);
    this.selectedReviewOnS = this.selectedReviewOnS === reviewOnSOnSite ? null : reviewOnSOnSite;
    this.reviewsOnSiSubscription.unsubscribe();
  }

  public onEventOnS(event: Event): void {
    console.log('Preventing Event default Propagation');
    event.stopPropagation();
  }

  public onDeleteOnS(reviewOnSOnSite: ReviewApp): void {
    this.reviewsOnSiDSubscription = this.reviewService.removeReview(reviewOnSOnSite._id)
      .subscribe({
        next: (dReview) => {
          console.log('Deleted Review ', dReview);
          this.reviewsOnSi = this.reviewsOnSi.filter(
            dReview => dReview._id !== reviewOnSOnSite._id,
          );
        },
        error: (error) => this.handleReviewOnSErrors(error.error),
      });
  }

  private handleReviewOnSErrors(errors: string[] | string): void {
    this.reviewsOnSListErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.reviewsOnSiSubscription.unsubscribe();
    this.reviewsOnSiDSubscription.unsubscribe();
  }
}
