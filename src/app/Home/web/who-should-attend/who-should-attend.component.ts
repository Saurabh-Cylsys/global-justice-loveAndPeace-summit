import { Component } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-who-should-attend',
  templateUrl: './who-should-attend.component.html',
  styleUrls: ['./who-should-attend.component.css']
})
export class WhoShouldAttendComponent {

  ngOnInit(): void {
 
    AOS.init({
      duration: 1200,
    });
  }

}
