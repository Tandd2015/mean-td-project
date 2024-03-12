import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { ReviewApp } from '../../models';

@Component({
  selector: 'app-testimonial-edit',
  templateUrl: './testimonial-edit.component.html',
  styleUrls: ['./testimonial-edit.component.css']
})
export class TestimonialEditComponent implements OnInit, OnDestroy {
  public reviewAppEditSubscription: Subscription = new Subscription();
  public reviewAppEdit: ReviewApp = new ReviewApp();
  public reviewEditErrors: string[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly reviewService: ReviewService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.reviewAppEditSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.reviewService.getReview(id as string)),
      )
      .subscribe({
        next: (reviewAppEdit) => {
          this.reviewAppEdit = reviewAppEdit;
        },
        error: (error) => this.handleReviewEditErrors(error.error.message)
      });
  }

  public onEditReviewSubmit(event: Event, form: NgForm): void {
    if (form.value.oResponse !== 'Terry Dockery Investigations and Security Services has not yet responded to customer review.' && this.reviewAppEdit.oRDate === null) {
      form.value.oRDate = new Date;
      console.log(form.value.oRDate, form.value, ' Hot this Here');
    }
    console.log('Editing ReviewApp', { ...form.value, _id: this.reviewAppEdit._id });
    this.reviewAppEditSubscription = this.reviewService.updateReview({...form.value, _id: this.reviewAppEdit._id})
      .subscribe({
        next: (updatedReviewAppEdit) => {
          console.log('The Edited ReviewApp', updatedReviewAppEdit);
          this.router.navigateByUrl('admin/dash');
        },
        error: (error) => this.handleReviewEditErrors(error.error),
      })
  }

  private handleReviewEditErrors(errors: string[] | string) {
    this.reviewEditErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.reviewAppEditSubscription.unsubscribe();
  }
}
