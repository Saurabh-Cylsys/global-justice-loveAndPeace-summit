import { Component, HostListener, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import { PeacekeeperService } from 'src/app/features/peacekeeper/services/peacekeeper.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-header',
  templateUrl: './peacekeeper-header.component.html',
  styleUrls: ['./peacekeeper-header.component.css'],
})
export class PeacekeeperHeaderComponent implements OnInit {
  userData: any;
  isMobileView = false;
  date: any;
  isCollapsed = false;
  private refreshSubscription: Subscription;
  PeaceBadgeData: any;

  constructor(private SharedService: SharedService,private peaceKeeperService : PeacekeeperService) {
    this.SharedService.isCollapsed$.subscribe((state) => {
      this.isCollapsed = state;
    });

    this.refreshSubscription = this.SharedService.refreshheader$.subscribe(async () => {
      await this.getPeaceBadgeData();
    });

  }

  ngOnInit(): void {
    this.date = new Date();
    this.userData = JSON.parse(localStorage.getItem('userDetails') || '');
    this.checkWindowSize();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.refreshSubscription.unsubscribe();
  }

  getPeaceBadgeData() {
    let userData = JSON.parse(localStorage.getItem('userDetails') || '');

    let peaceId = userData.peacekeeper_id;
    let body = {
      peace_id: peaceId,
    };

    this.peaceKeeperService.getPeacekeeperBadgeById(body).subscribe({
      next:(res:any)=>{
        this.PeaceBadgeData = this.SharedService.decryptData(res.data);


         this.userData = localStorage.setItem('userDetails', JSON.stringify(this.PeaceBadgeData));


        // this.imageUrl = this.PeaceBadgeData?.file_name;
      }
    })
  }


  toggleSidebar() {
    this.SharedService.toggleSidebar(); // Call the service method
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

  toggleOffcanvas() {
    const body = document.getElementById('bodyload');
    if (body) {
      body.removeAttribute('style');
    }
  }
}
