import { Component, OnInit, OnDestroy, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Section } from '../../models';
import { SectionService } from '../../services/section.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnChanges, OnDestroy {
  public navErrors: string[] = [];
  @Input() selectedNavSection: Section = new Section();

  public navExtenderInvestigations: boolean = false;
  public navExtenderSecuritySurveillance: boolean = false;
  public investigationsHomeScreenId: string = '631a5d765d8ca096b4ac989a';
  public securitySurveillanceHomeScreenId: string = '63192eda5d8ca096b4ac9896';

  constructor(
    private readonly navService: SectionService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let i in changes) {
      this.navExtenderSecuritySurveillance = false;
      this.navExtenderInvestigations = false;

      if(changes[i].currentValue._id !== undefined) {

        if(changes[i].currentValue._id !== this.investigationsHomeScreenId && changes[i].currentValue._id !== this.securitySurveillanceHomeScreenId) {
          if(changes[i].currentValue.title.slice(changes[i].currentValue.title.length-21, changes[i].currentValue.title.length) === 'Surveillance Services' || changes[i].currentValue.title.slice(changes[i].currentValue.title.length-17, changes[i].currentValue.title.length) === 'Security Services') {
            this.navExtenderSecuritySurveillance = true;
          }

          if(changes[i].currentValue.title.slice(changes[i].currentValue.title.length-14, changes[i].currentValue.title.length) === 'Investigations') {
            this.navExtenderInvestigations = true;
          }

        } else if(changes[i].currentValue._id === this.investigationsHomeScreenId || changes[i].currentValue._id === this.securitySurveillanceHomeScreenId) {
          this.navExtenderSecuritySurveillance = false;
          this.navExtenderInvestigations = false;
        }
      }
    }
  }

  private handleNavErrors(errors: string[] | string): void {
    this.navErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.selectedNavSection = new Section();
  }
}
