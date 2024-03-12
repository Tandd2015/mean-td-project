import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Output() newActOne: EventEmitter<boolean> = new EventEmitter<boolean>();
  public actOne: boolean = false;

  public activeRoute: string = '';
  public routerEvents: any;
  public readonly breakPoint$: any = this.breakPointObserver.observe(['(max-width: 565px)']).pipe(
    distinctUntilChanged()
  )
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly breakPointObserver: BreakpointObserver
  ) {
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      };
    });
  };

  ngOnInit(): void {
    this.breakPoint$.subscribe((breakpoints: any) => {
      this.breakpointChanged();
    });
  }

  private breakpointChanged(): void {
    if(this.breakPointObserver.isMatched('(min-width: 565px)')) {
      this.actOne = false;
    }
  }

  public mobileMenu(event: Event, aO: boolean): void {
    this.newActOne.emit(aO);
    this.actOne = this.actOne === true ? false : true;
  }

  public navScroll(navClick: Event): void {
    navClick.preventDefault();
  }

  public toAbout(navClick: Event): void {
    navClick.preventDefault();
    if (this.activeRoute === '/home/dash') {
      document.getElementById("appAbout")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    } else {
      this.router.navigate(['/home/dash']);
      document.getElementById("appAbout")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  public toContact(navClick: Event): void {
    navClick.preventDefault();
    if (this.activeRoute === '/home/dash') {
      document.getElementById("appContact")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    } else {
      this.router.navigate(['/home/dash']);
      document.getElementById("appContact")?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  ngOnDestroy(): void {
    this.routerEvents.unsubscribe();
  }
}
