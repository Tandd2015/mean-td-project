import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  public sitePrivacy: string = 'this website';
  public businessPrivacy: string = 'Terry Dockery Investigations and Security Services';
  public effectiveDatePrivacy: string = '06-07-2022';
  public effectiveReviewDatePrivacy: string = '06-07-2022';
  public effectiveReviewDateCaliPrivacy: string = '06-30-2020';
  public effectiveDateCaliPrivacy: string = '06-07-2022';
  public emailPrivacy: string = 'terrydockery2@gmail.com';
  public phonePrivacy: string = '4198903021';
  public phoneDisplayPrivacy: string = '419-890-3021';
  public mainAddress1Privacy: string ='300 Oak St';
  public mainAddress2Privacy: string ='Continental, OH, 45831';
  constructor() { }

  ngOnInit(): void {
  }

}
