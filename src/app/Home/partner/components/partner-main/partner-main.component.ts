import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-partner-main',
  templateUrl: './partner-main.component.html',
  styleUrls: ['./partner-main.component.css']
})
export class PartnerMainComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  }
}
