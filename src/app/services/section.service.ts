import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Section } from '../models';


@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private readonly sectionBaseUrl = '/api/home/sections';

  constructor(private readonly _http: HttpClient) { }

  getSections(): Observable<Section[]> {
    return this._http.get<Section[]>(`${this.sectionBaseUrl}/all`).pipe(
      catchError(this.handleServiceSectionErrors<Section[]>('getSections', []))
    );
  }

  createSection(section: Section, file: File): Observable<any> {
    const newSectionFormEnd: FormData = new FormData();
    newSectionFormEnd.append('title', section.title);
    newSectionFormEnd.append('content', section.content);
    newSectionFormEnd.append('sectionImageAttributionCredit', section.sectionImageAttributionCredit);
    newSectionFormEnd.append('sectionImageAttributionLink', section.sectionImageAttributionLink);
    newSectionFormEnd.append('sectionImage', file);
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('POST', this.sectionBaseUrl, newSectionFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServiceSectionErrors<any>(`createSection`))
    );
  }

  getSection(sectionId: string): Observable<Section> {
    return this._http.get<Section>(`${this.sectionBaseUrl}/single/${sectionId}`).pipe(
      catchError(this.handleServiceSectionErrors<Section>(`getSection id=${sectionId}`))
    );
  }

  updateSection(section: Section): Observable<Section> {
    return this._http.put<Section>(`${this.sectionBaseUrl}/${section._id}`, section).pipe(
      catchError(this.handleServiceSectionErrors<Section>(`updateSection id=${section._id}`))
    );
  }

  removeSection(sectionId: string): Observable<Section> {
    return this._http.delete<Section>(`${this.sectionBaseUrl}/${sectionId}`).pipe(
      catchError(this.handleServiceSectionErrors<Section>(`removeSection id=${sectionId}`))
    );
  }

  private handleServiceSectionErrors<T>(operation = 'operation', result?: T) {
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
}
