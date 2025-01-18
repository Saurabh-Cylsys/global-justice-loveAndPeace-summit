import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})
export class AwardsComponent {
  isMobileView = false;
  constructor(
      private _activeRouter:ActivatedRoute, 
      private SharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();
    this._activeRouter.fragment.subscribe((fragment) => {
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
