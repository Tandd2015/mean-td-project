import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-terms',
  templateUrl: './service-terms.component.html',
  styleUrls: ['./service-terms.component.css']
})
export class ServiceTermsComponent implements OnInit {
  public siteServiceTerm: string = 'this website';
  public businessServiceTerm: string = 'Terry Dockery Investigations and Security Services';
  public emailServiceTerm: string = 'terrydockery2@gmail.com';
  public effectiveDateServiceTerm: string = '06-07-2022';

  constructor() { }

  ngOnInit(): void {
  }

}
