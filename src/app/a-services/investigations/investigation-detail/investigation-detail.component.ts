import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Section } from '../../../models';
import { SectionService } from '../../../services/section.service';


@Component({
  selector: 'app-investigation-detail',
  templateUrl: './investigation-detail.component.html',
  styleUrls: ['./investigation-detail.component.css']
})
export class InvestigationDetailComponent implements OnInit, OnDestroy {
  public selectedInvestigationErrors: string[] = [];

  public investigationsDetail: Array<Section> = [];
  public investigationsDetailSubscription: Subscription = new Subscription();

  public sInvestigationD: Section = new Section();
  public sInvestigationDStart: void = this.navInvestigationD();
  public sInvestigationDSubscription: Subscription = new Subscription();
  public sInvestigationDContentSplit: String[] = [];

  public sInvestigation: Section = new Section();
  public sInvestigationSubscription: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly investigationService: SectionService
  ) { };

  ngOnInit(): void {
    this.sInvestigationSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.investigationService.getSection(id as string)),
      )
      .subscribe({
        next: (sInvestigation) => {
          this.sInvestigation = sInvestigation;
          this.sInvestigationDContentSplit = sInvestigation.content.split("\n");
        },
        error: (error) => this.handleSelectedInvestigationErrors(error.error.message)
      });

    this.investigationsDetailSubscription = this.investigationService.getSections()
      .subscribe({
        next: (investigationsDetail) => {
          for (let investigationD in investigationsDetail) {
            if(investigationsDetail[investigationD].title.slice(investigationsDetail[investigationD].title.length-14, investigationsDetail[investigationD].title.length) === 'Investigations') {
              this.investigationsDetail.push(investigationsDetail[investigationD]);
            };
            if(investigationsDetail[investigationD].title === 'Investigations Home') {
              this.investigationsDetail.push(investigationsDetail[investigationD]);
            };
          };
        },
        error: (error) => this.handleSelectedInvestigationErrors(error.error),
      });
  };

  public navInvestigationD(): void {
    this.sInvestigationDSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.investigationService.getSection(id as string)),
      )
      .subscribe({
        next: (sInvestigationD) => {
          this.sInvestigationD = sInvestigationD;
        },
        error: (error) => this.handleSelectedInvestigationErrors(error.error.message)
      });
  };

  private handleSelectedInvestigationErrors(errors: string[] | string): void {
    this.selectedInvestigationErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.sInvestigationSubscription.unsubscribe();
    this.sInvestigationDSubscription.unsubscribe();
    this.investigationsDetailSubscription.unsubscribe();
  };
}
