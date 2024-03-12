import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import * as fromPosts from './posts';
import * as fromAdmin from './admin';
import * as fromContact from './contact';
import * as fromReview from './testimonials'
import * as fromServices from './a-services';
import * as fromPolicy from './a-policy';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { AboutComponent } from './about/about.component';
import { SectionsComponent } from './sections/sections.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from './carousel/carousel.module';
import { DynamicFontSizeDirective } from './directives/dynamic-font-size.directive';
import { UCookieComponent } from './u-cookie/u-cookie.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NotFoundComponent,
    ...fromPosts.components,
    ...fromAdmin.components,
    ...fromContact.components,
    ...fromReview.components,
    ...fromServices.components,
    ...fromPolicy.components,
    SlideShowComponent,
    AboutComponent,
    SectionsComponent,
    HomeComponent,
    DynamicFontSizeDirective,
    UCookieComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    NgbModule,
    GoogleMapsModule,
    NoopAnimationsModule,
    CarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
