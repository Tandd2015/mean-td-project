import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.css']
})
export class CookieComponent implements OnInit {
  public thisSite: string = 'this website';
  public thisSiteC: string = 'This Website';
  public effectiveDateCookie: string = '06-07-2022';


  constructor() { }

  ngOnInit(): void {
  }

}
