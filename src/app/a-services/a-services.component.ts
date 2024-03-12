import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Section } from '../models';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-a-services',
  templateUrl: './a-services.component.html',
  styleUrls: ['./a-services.component.css']
})
export class AServicesComponent implements OnInit, OnDestroy {
  public sectionsListErrors: string[] = [];

  public sections: Array<Section> = [];
  public sectionsSubscription: Subscription = new Subscription();
  constructor(
    private readonly sectionService: SectionService,
  ) { };

  ngOnInit(): void {
    this.sectionsSubscription = this.sectionService.getSections()
      .subscribe({
        next: (sections) => {
          for (let section in sections) {
            if(sections[section].title !== 'Security and Surveillance Home' && 'Investigations Home' !== sections[section].title) {
              this.sections.push(sections[section]);
            };
          };
        },
        error: (error) => this.handleSectionErrors(error.error),
      });
  };

  private handleSectionErrors(errors: string[] | string): void {
    this.sectionsListErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.sectionsSubscription.unsubscribe();
  };
};
