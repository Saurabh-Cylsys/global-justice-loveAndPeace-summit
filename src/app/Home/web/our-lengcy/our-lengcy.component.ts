import { Component } from '@angular/core';
declare var AOS:any;

@Component({
  selector: 'app-our-lengcy',
  templateUrl: './our-lengcy.component.html',
  styleUrls: ['./our-lengcy.component.css']
})
export class OurLengcyComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("our legacy");
  
  }
}
