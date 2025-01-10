import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
declare var AOS: any;
@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.css'],
})
export class DownloadCenterComponent {
  isMobileView = false;
  constructor(private router: ActivatedRoute, private SharedService: SharedService,) {}
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
    });
    console.log('download center');
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
