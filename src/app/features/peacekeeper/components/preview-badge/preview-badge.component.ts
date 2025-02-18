import { Component, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PeacekeeperService } from '../../services/peacekeeper.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-preview-badge',
  templateUrl: './preview-badge.component.html',
  styleUrls: ['./preview-badge.component.css']
})
export class PreviewBadgeComponent {
  editBadgeForm!: FormGroup;
  PeaceBadgeData: any;
  disabledDates: Date[] = [];
  peaceBadge: any;
  formdisplay: boolean = true;
  showPopup: boolean = false;
  isPeaceOn: number = -1;
  display: string = '';
  zoomLevel: number = 1; // Initial zoom level

  imageUrl: string | ArrayBuffer | null =
    'assets/UIComponents/images/speakers/ProfileAavtar.png'; // Default image
  isCollapsed = false;
  isMobileView = false;
  isDisabled = true;


  constructor(
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
  ) {

  }

  async ngOnInit() {

    await this.getPeaceBadgeData();
    this.checkWindowSize();
  }


  async getPeaceBadgeData() {
    let userData = JSON.parse(localStorage.getItem('userDetails') || '');

    let peaceId = userData.peacekeeper_id;
    let body = {
      peace_id: peaceId,
    };

    this.ngxService.start();
    await this.peaceKeeperService.getPeacekeeperBadgeById(body).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.ngxService.stop();
          this.PeaceBadgeData = this.sharedService.decryptData(res.data);

          this.peaceBadge = this.PeaceBadgeData.coupon_code;
          this.imageUrl = this.PeaceBadgeData?.file_name;
        }

      },
      error : (err)=>{
        console.log("err",err);
        this.ngxService.stop();
      }
    });
  }

  openPopup() {

    this.showPopup = true;
    this.isPeaceOn = 0;
    this.display = 'block';
    this.formdisplay = false;
  }


  downloadImage() {
    if (this.peaceBadge) {
      fetch(this.peaceBadge)
      .then(response => response.blob())  // Convert response to Blob
      .then(blob => {
        const url = URL.createObjectURL(blob); // Create an object URL for the blob
        const link = document.createElement('a');
        link.href = url;
        link.download = 'peacekeeper-card.png'; // Ensure it's saved as PNG
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the object URL
      })
      .catch(error => console.error('Error downloading the image:', error));
    }


    setTimeout(() => {
      this.display = 'none';
      this.showPopup = false;
    }, 500);
  }

  closeModal() {
    this.display = 'none';
    this.showPopup = false;
  }

    checkWindowSize(): void {
      if (window.innerWidth <= 900) {
        this.sharedService.isMobileView.next(true);
        this.isMobileView = true;
      } else {
        this.sharedService.isMobileView.next(false);
        this.isMobileView = false;
      }
    }
    // Listen to window resize events
    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      this.checkWindowSize();
    }
}
