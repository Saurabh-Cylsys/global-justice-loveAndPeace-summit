import { Component, HostListener } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isCollapsed = false;
  isMobileView = false;

  constructor(private SharedService: SharedService,) {
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  ngOnInit(): void {
      this.checkWindowSize();
    }
    checkWindowSize(): void {
      if (window.innerWidth <= 900) {
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
