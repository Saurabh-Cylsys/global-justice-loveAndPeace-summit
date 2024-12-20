import { Component } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
declare var AOS:any;
@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.css']
})
export class DownloadCenterComponent {
  constructor( private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("download center");
  
  }

  ngAfterViewInit(): void {
    this.router.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
