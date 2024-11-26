import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-event-partners',
  templateUrl: './event-partners.component.html',
  styleUrls: ['./event-partners.component.css']
})
export class EventPartnersComponent {

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("home");
  
  }
}
