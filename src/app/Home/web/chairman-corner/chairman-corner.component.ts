import { Component, HostListener } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-chairman-corner',
  templateUrl: './chairman-corner.component.html',
  styleUrls: ['./chairman-corner.component.css']
})
export class ChairmanCornerComponent {
  isMobileView = false;
  constructor( private router: ActivatedRoute,
    public _router: Router,
        private SharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();
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

  checkWindowSize(): void {
      if (window.innerWidth <= 767) {
        this.SharedService.isMobileView.next(true);
        this.isMobileView = true;
      } else {
        this.SharedService.isMobileView.next(false);
        this.isMobileView = false;
      }
    }
  
    // Listen to window resize events
    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      this.checkWindowSize();
    }
}
