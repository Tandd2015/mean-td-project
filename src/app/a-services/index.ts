import { AServicesComponent } from './a-services.component';
import { NavComponent } from './nav/nav.component';
import { InvestigationListComponent } from './investigations/investigation-list/investigation-list.component';
import { InvestigationDetailComponent } from './investigations/investigation-detail/investigation-detail.component';
import { SecuritySurveillanceDetailComponent } from './security-surveillance/security-surveillance-detail/security-surveillance-detail.component';
import { SecuritySurveillanceListComponent } from './security-surveillance/security-surveillance-list/security-surveillance-list.component';

export const components: any[] = [
  AServicesComponent,
  NavComponent,
  InvestigationListComponent,
  InvestigationDetailComponent,
  SecuritySurveillanceListComponent,
  SecuritySurveillanceDetailComponent
];

export * from './a-services.component';
export * from  './nav/nav.component';
export * from './investigations/investigation-list/investigation-list.component';
export * from './investigations/investigation-detail/investigation-detail.component';
export * from './security-surveillance/security-surveillance-list/security-surveillance-list.component';
export * from './security-surveillance/security-surveillance-detail/security-surveillance-detail.component';

