import { Component, HostListener } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import {ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent {
  isMobileView = false;
  // headerIcon:any
  constructor( private SharedService: SharedService, private ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();

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

  ngAfterViewInit(): void {
    this.ActivatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

}
