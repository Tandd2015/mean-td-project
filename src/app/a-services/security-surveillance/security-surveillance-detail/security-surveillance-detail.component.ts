import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Section } from '../../../models';
import { SectionService } from '../../../services/section.service';
@Component({
  selector: 'app-security-surveillance-detail',
  templateUrl: './security-surveillance-detail.component.html',
  styleUrls: ['./security-surveillance-detail.component.css']
})
export class SecuritySurveillanceDetailComponent implements OnInit, OnDestroy {
  public selectedSecuritySurveillanceErrors: string[] = [];

  public securityDetail: Array<Section> = [];
  public surveillanceDetail: Array<Section> = [];
  public securitySurveillanceDetail: Section = new Section();
  public securitySurveillanceDetailSubscription: Subscription = new Subscription();

  public securitySurveillanceD: Section = new Section();
  public securitySurveillanceDStart: void = this.navSecuritySurveillanceD();
  public securitySurveillanceDSubscription: Subscription = new Subscription();
  public securitySurveillanceContentSplit: Array<String> = [];

  public securitySurveillance: Section = new Section();
  public securitySurveillanceSubscription: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly securitySurveillanceService: SectionService
  ) { };

  ngOnInit(): void {
    this.securitySurveillanceSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.securitySurveillanceService.getSection(id as string)),
      )
      .subscribe({
        next: (securitySurveillance) => {
          this.securitySurveillance = securitySurveillance;
          this.securitySurveillanceContentSplit = securitySurveillance.content.split("\n");
        },
        error: (error) => this.handleSelectedSecuritySurveillanceErrors(error.error.message)
      });

    this.securitySurveillanceDetailSubscription = this.securitySurveillanceService.getSections()
      .subscribe({
        next: (surveillanceD) => {
          for (let surD in surveillanceD) {
            if(surveillanceD[surD].title.slice(surveillanceD[surD].title.length-21, surveillanceD[surD].title.length) === 'Surveillance Services') {
              this.surveillanceDetail.push(surveillanceD[surD]);
            };

            if(surveillanceD[surD].title.slice(surveillanceD[surD].title.length-17, surveillanceD[surD].title.length) === 'Security Services') {
              this.securityDetail.push(surveillanceD[surD]);
            };

            if(surveillanceD[surD].title === 'Security and Surveillance Home') {
              this.securitySurveillanceDetail = surveillanceD[surD];
            };
          };
        },
        error: (error) => this.handleSelectedSecuritySurveillanceErrors(error.error),
      });
  };

  public navSecuritySurveillanceD(): void {
    this.securitySurveillanceDSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.securitySurveillanceService.getSection(id as string)),
      )
      .subscribe({
        next: (securitySurveillanceD) => {
          this.securitySurveillanceD = securitySurveillanceD;
        },
        error: (error) => this.handleSelectedSecuritySurveillanceErrors(error.error.message)
      });
  };

  private handleSelectedSecuritySurveillanceErrors(errors: string[] | string): void {
    this.selectedSecuritySurveillanceErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.securitySurveillanceSubscription.unsubscribe();
    this.securitySurveillanceDSubscription.unsubscribe();
    this.securitySurveillanceDetailSubscription.unsubscribe();
  };
};
