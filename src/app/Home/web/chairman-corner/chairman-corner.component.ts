import { Component } from '@angular/core';
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chairman-corner',
  templateUrl: './chairman-corner.component.html',
  styleUrls: ['./chairman-corner.component.css']
})
export class ChairmanCornerComponent {
  constructor( private router: ActivatedRoute
  ) {}
  
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
