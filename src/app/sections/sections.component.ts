import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Section } from '../models';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit, OnDestroy {
  public sectionsAListErrors: string[] = [];

  public sectionsA: Array<Section> = [];
  public sectionsASubscription: Subscription = new Subscription();
  constructor(
    private readonly sectionAService: SectionService,
  ) { }

  ngOnInit(): void {
    this.sectionsASubscription = this.sectionAService.getSections()
    .subscribe({
      next: (sectionsA) => {
        for (let sectionA in sectionsA) {
          if(sectionsA[sectionA].title !== 'Security and Surveillance Home' && 'Investigations Home' !== sectionsA[sectionA].title) {
            this.sectionsA.push(sectionsA[sectionA]);
          }
        }
      },
      error: (error) => this.handleSectionAErrors(error.error),
    });
  }

  public toAboutApp(navClick: Event): void {
    navClick.preventDefault();
    document.getElementById("appAbout")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  public toContactApp(navClick: Event): void {
    navClick.preventDefault();
    document.getElementById("appContact")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  private handleSectionAErrors(errors: string[] | string): void {
    this.sectionsAListErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.sectionsASubscription.unsubscribe();
  }
}
