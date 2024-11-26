import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var AOS:any;
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {

  
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("faqs");
  
  }
  constructor(private router:Router){}
}
