import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public isReadMore: boolean = true;
  public isShowReadMore: boolean = true;
  public readonly breakPointAbout: any = this.breakPointObserverAbout.observe(['(max-width: 600px)']).pipe(distinctUntilChanged());
  constructor(private readonly breakPointObserverAbout: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakPointAbout.subscribe((bPoints: any) => {
      this.aboutToggleIsShowReadMore();
    });
  }

  public aboutToggleIsReadMore(): void {
    this.isReadMore = this.isReadMore === true ? !this.isReadMore : true;
  }

  public aboutToggleIsShowReadMore(): void {
    if(this.breakPointObserverAbout.isMatched('(min-width: 600px)')) {
      this.isShowReadMore = true;
      this.isReadMore = true;
    }
    if(this.breakPointObserverAbout.isMatched('(max-width: 600px)')) {
      this.isShowReadMore = false;
      this.isReadMore = false;
    }
  }
}
