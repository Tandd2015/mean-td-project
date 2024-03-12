import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs/operators';
import { Section } from '../../../models';
import { SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-security-surveillance-list',
  templateUrl: './security-surveillance-list.component.html',
  styleUrls: ['./security-surveillance-list.component.css']
})
export class SecuritySurveillanceListComponent implements OnInit, OnDestroy {
  public securitySurveillanceListErrors: string[] = [];

  public security: Array<Section> = [];
  public surveillance: Array<Section> = [];
  public surveillanceSubscription: Subscription = new Subscription();
  public surveillanceContentSplit: String[] = [];

  public readonly breakPointSec$: any = this.breakPointObserverSec.observe(['(max-width: 481px)']).pipe(
    distinctUntilChanged()
  )
  @Output() securitySwapEv: EventEmitter<boolean> = new EventEmitter<boolean>();
  public securitySwap: boolean = true;

  public securitySurveillanceStart: void = this.navSecuritySurveillance('644aa0ce838bea785cd3ada5')
  public securitySurveillance: Section = new Section();
  public securitySurveillanceSubscription: Subscription = new Subscription();
  constructor(
    private readonly securitySurveillanceService: SectionService,
    private readonly breakPointObserverSec: BreakpointObserver,
  ) { }

  ngOnInit(): void {

    this.surveillanceSubscription = this.securitySurveillanceService.getSections()
      .subscribe({
        next: (surveillance) => {
          for (let sur in surveillance) {
            if(surveillance[sur].title.slice(surveillance[sur].title.length-21, surveillance[sur].title.length) === 'Surveillance Services') {
              this.surveillance.push(surveillance[sur]);
            };

            if(surveillance[sur].title.slice(surveillance[sur].title.length-17, surveillance[sur].title.length) === 'Security Services') {
              this.security.push(surveillance[sur]);
            };

            if(surveillance[sur].title === 'Security and Surveillance Home') {
              this.securitySurveillance = surveillance[sur];
              this.surveillanceContentSplit = surveillance[sur].content.split("\n");
            };
          };
        },
        error: (error) => this.handleSecuritySurveillanceErrors(error.error),
      });

    this.breakPointSec$.subscribe((breakpoints: any) => {
      this.breakPointChangedSec();
    });

    this.securitySwapper(this.securitySwap);
  };

  public securitySwapper(secSwap: boolean): void {
    this.securitySwapEv.emit(secSwap);
  };

  private breakPointChangedSec(): void {
    if(this.breakPointObserverSec.isMatched('(max-width: 481px)')) {
      this.securitySwap = true;
      this.securitySwapper(this.securitySwap);
    };
    if(this.breakPointObserverSec.isMatched('(min-width: 481px)')) {
      this.securitySwap = false;
      this.securitySwapper(this.securitySwap);
    };
  };

  public navSecuritySurveillance(navSecuritySurveillanceId: string) {
    this.securitySurveillanceSubscription = this.securitySurveillanceService.getSection(navSecuritySurveillanceId)
      .subscribe({
        next: (nSecuritySurveillance) => {
          this.securitySurveillance = nSecuritySurveillance;
        },
        error: (error) => this.handleSecuritySurveillanceErrors(error.error),
      });
  };

  private handleSecuritySurveillanceErrors(errors: string[] | string): void {
    this.securitySurveillanceListErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.securitySurveillanceSubscription.unsubscribe();
    this.surveillanceSubscription.unsubscribe();

    this.securitySwap = false;
    this.securitySwapper(this.securitySwap);
  };
};
