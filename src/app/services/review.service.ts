import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReviewApp, Review } from '../models';
// import { MessageService } from './';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  // public serviceReviewsErrors: string[] = [];
  private readonly reviewBaseUrl = '/api/home/reviews';

  // public httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  constructor(private readonly _http: HttpClient) { }

  getGoogleReviews(): Observable<Review[]> {
    return this._http.get<Review[]>(`${this.reviewBaseUrl}/all`).pipe(
      catchError(this.handleServiceReviewErrorsTwo<Review[]>('getGoogleReviews', []))
    );
  }

  getSiteReviews(): Observable<ReviewApp[]> {
    return this._http.get<ReviewApp[]>(`${this.reviewBaseUrl}/site-only`).pipe(
      catchError(this.handleServiceReviewErrorsTwo<ReviewApp[]>('getSiteReviews', []))
    );
  }

  // createReview(review: ReviewApp, file: File): Observable<ReviewApp> {
  //   return this._http.post<ReviewApp>(this.reviewBaseUrl, review).pipe(
  //     catchError(this.handleServiceReviewErrorsTwo<ReviewApp>(`createReview`))
  //   );
  // }

  createReview(review: ReviewApp, file: File): Observable<any> {
    const newReviewAppFormEnd: FormData = new FormData();
    newReviewAppFormEnd.append('content', review.content);
    newReviewAppFormEnd.append('writtenBy', review.writtenBy);
    newReviewAppFormEnd.append('byRating', review.byRating.toString());
    newReviewAppFormEnd.append('byImage', file);
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('POST', this.reviewBaseUrl, newReviewAppFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServiceReviewErrorsTwo<any>(`createReview`))
    );
  }

  getReview(reviewId: string): Observable<ReviewApp> {
    return this._http.get<ReviewApp>(`${this.reviewBaseUrl}/single/${reviewId}`).pipe(
      catchError(this.handleServiceReviewErrorsTwo<ReviewApp>(`getReview id=${reviewId}`))
    );
  }

  updateReview(review: ReviewApp): Observable<ReviewApp> {
    return this._http.put<ReviewApp>(`${this.reviewBaseUrl}/${review._id}`, review).pipe(
      catchError(this.handleServiceReviewErrorsTwo<ReviewApp>(`updateReview id=${review._id}`))
    );
  }

  removeReview(reviewId: string): Observable<ReviewApp> {
    return this._http.delete<ReviewApp>(`${this.reviewBaseUrl}/${reviewId}`).pipe(
      catchError(this.handleServiceReviewErrorsTwo<ReviewApp>(`removeReview id=${reviewId}`))
    );
  }

  // private handleServiceReviewErrors(errors: string[] | string): void {
  //   this.serviceReviewsErrors = Array.isArray(errors) ? errors : [errors];
  // }

  private handleServiceReviewErrorsTwo<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console logging the error
      console.error(`${operation} failed: ${error.message}`);

      // send error to remote logging infrastruce
      // formatting error to be better readable for humans
      // this.log(`${operation} failed: ${error.message}`);

      // app continues running with empty result returned
      return of(result as T);
    };
  }

  // private log(errorMessage: string) {
  //   this.messageService.add(`ReviewService: ${errorMessage}`);
  // }
}


  // private reviewRatingTwo: number = 0;
  // private preReviewsOnSite: Array<ReviewApp> = [];
  // private reviewsOnSite: BehaviorSubject<ReviewApp[]> = new BehaviorSubject<ReviewApp[]>([]);
  // private afterReviewOnSite: Observable<ReviewApp[]> = this.reviewsOnSite.asObservable();

  // onGetSiteR(): Observable<ReviewApp[]> {
  //   return this.afterReviewOnSite;
  // }

  // onSetSiteR(reviews: ReviewApp[]): void {
  //   return this.reviewsOnSite.next(reviews);
  // }

  // onGetSiteReviews(): void {
  //   this.getSiteReviews()
  //     .subscribe({
  //       next: (reviewsOnSite) => {
  //         reviewsOnSite.forEach((reviews, idx, arr) => {
  //           reviews.createdAt?.slice(0,10).split('-').forEach((createdAtItem, index, array) => {
  //             if(index === 2) {
  //               reviews.createdAt = `${array[1]}-${array[2]}-${array[0]}`;
  //               console.log('Got This');
  //             }
  //           });
  //           this.reviewRatingTwo = reviews.byRating as number;
  //           this.preReviewsOnSite.push(reviews);
  //         })
  //         this.onSetSiteR(this.preReviewsOnSite);
  //       },
  //       error: (error) => this.handleServiceReviewErrors(error.error),
  //     });
  // }
