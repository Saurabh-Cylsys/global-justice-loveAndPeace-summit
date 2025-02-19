import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-leftpanel',
  templateUrl: './peacekeeper-leftpanel.component.html',
  styleUrls: ['./peacekeeper-leftpanel.component.css'],
})
export class PeacekeeperLeftpanelComponent {
  isCollapsed = false;
  isMobileView = false;
  constructor(private SharedService: SharedService,private router : Router) {
    this.SharedService.isCollapsed$.subscribe((state) => {
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

  logout(){
    localStorage.clear(); // Optional: Clear sessionStorage if used
    sessionStorage.clear();
    this.router.navigate(['/login']); // Redirect to login
  }
}
