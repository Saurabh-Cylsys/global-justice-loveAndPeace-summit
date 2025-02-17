import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS  from 'aos';
// declare var AOS:any;

@Component({
  selector: 'app-web-main',
  templateUrl: './web-main.component.html',
  styleUrls: ['./web-main.component.css']
})
export class WebMainComponent {
  url : any;

  ngOnInit(): void {
    AOS.init({
      duration: 1200,

  })
  console.log("web main");
  console.log("router", this.router.url);
  this.url = this.router.url;
  
  }
  constructor(
    // private _shared: SharedService,
    private router: Router,
    private _route: ActivatedRoute,
    // private CompanyService: CompanyService,

  ) { }

}
