import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() securitySwap: boolean = false;

  constructor(private readonly contactBrakePointObserver: BreakpointObserver) {}

  ngOnInit(): void {}
}
