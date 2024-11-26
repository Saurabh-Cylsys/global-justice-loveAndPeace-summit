import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("about us");
  
  }
}
