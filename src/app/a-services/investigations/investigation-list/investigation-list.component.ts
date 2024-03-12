import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Section } from '../../../models';
import { SectionService } from '../../../services/section.service';
@Component({
  selector: 'app-investigation-list',
  templateUrl: './investigation-list.component.html',
  styleUrls: ['./investigation-list.component.css']
})
export class InvestigationListComponent implements OnInit, OnDestroy {
  public investigationsListErrors: string[] = [];

  public investigations: Array<Section> = [];
  public investigationsSubscription: Subscription = new Subscription();

  public selectedSection: any = null;

  public investigationStart: void = this.navInvestigation('644aa1bc838bea785cd3ada8');

  public investigationsReadMore: boolean = false;

  public investigation: Section = new Section();
  public investigationSubscription: Subscription = new Subscription();
  constructor(
    private readonly investigationService: SectionService,
  ) { };

  ngOnInit(): void {
    this.investigationsSubscription = this.investigationService.getSections()
      .subscribe({
        next: (investigations) => {
          for (let investigation in investigations) {
            if(investigations[investigation].title.slice(investigations[investigation].title.length-14, investigations[investigation].title.length) === 'Investigations') {
              this.investigations.push(investigations[investigation]);
            };
            if(investigations[investigation].title === 'Investigations Home') {
              this.investigations.push(investigations[investigation]);
            };
          };
        },
        error: (error) => this.handleInvestigationErrors(error.error),
      });
  };

  public aboutToggleInvestigationsReadMore(): void {
    this.investigationsReadMore = this.investigationsReadMore === true ? !this.investigationsReadMore : true;
  };

  public navInvestigation(navInvestigationId: string): void {
    this.investigationSubscription = this.investigationService.getSection(navInvestigationId)
      .subscribe({
        next: (nInvestigation: Section) => {
          this.investigation = nInvestigation;
        },
        error: (error: any) => this.handleInvestigationErrors(error.error)
      });
  };

  private handleInvestigationErrors(errors: string[] | string): void {
    this.investigationsListErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.investigationSubscription.unsubscribe();
    this.investigationsSubscription.unsubscribe();
  };
};
