import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.css'],
})
export class WebHeaderComponent implements OnInit{
  headerIcon:any;
  isHomePage: boolean = false;
  isMobileView = false;
  constructor(public _router: Router,private _activeRouter:ActivatedRoute, private SharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.checkWindowSize();
    this.headerIcon = this.SharedService.headerIcon;
    console.log(this.headerIcon,"hhhhhh");
    console.log(this._activeRouter.url,'WebHeaderComponent initialized');

    this._router.events.subscribe(() => {
      this.isHomePage = this._router.url === '/webhome';
    });
  }

  displayMyDIV: boolean = false; // Initialize the visibility property

  // toggleVisibility() {
  //   this.displayMyDIV = !this.displayMyDIV;

  //   // Get the arrow element by ID
  //   const arrowElement = document.getElementById('arrow-icon');
  //   if (arrowElement) {
  //     if (this.displayMyDIV) {
  //       arrowElement.classList.remove('arrow-down');
  //       arrowElement.classList.add('arrow-up');
  //     } else {
  //       arrowElement.classList.remove('arrow-up');
  //       arrowElement.classList.add('arrow-down');

  //     }
  //   }
  //   }
  toggleVisibility() {
    const myDIV = document.getElementById('myDIV');
    const arrowElement = document.getElementById('arrow-icon');

    if (myDIV && arrowElement) {
      if (!this.displayMyDIV) {
        // Open with a transition
        myDIV.style.maxHeight = '500px';
        arrowElement.classList.remove('arrow-down');
        arrowElement.classList.add('arrow-up');
      } else {
        // Close with the same transition
        myDIV.style.maxHeight = '0';
        arrowElement.classList.remove('arrow-up');
        arrowElement.classList.add('arrow-down');
        // Add a timeout to remove the 'open' class after the transition completes
        setTimeout(() => {
          myDIV.classList.remove('open');
        }, 1000); // Adjust this value to match your transition duration (3 seconds in this case)
      }
    }

    this.displayMyDIV = !this.displayMyDIV;
  }

  display = false;
  abhi() {
    this.display = !this.display;
  }

  // refreshPage() {
  //   this._router.navigate(['/webhome']).then(() => {
  //     console.log("test");
  //     location.reload();
  //   });
  // }

  refreshPage(route: string) {
    switch (route) {
      case 'webhome':
        this._router.navigate(['/webhome']).then(() => {
          console.log("Navigated to 'webhome'");
          location.reload();
        });
        break;
      case 'awards':
        this._router.navigate(['/awards']).then(() => {
          console.log("Navigated to 'awards'");
          location.reload();
        });
        break;
      case 'OurLengcy':
        this._router.navigate(['/OurLengcy']).then(() => {
          console.log("Navigated to 'OurLengcy'");
          location.reload();
        });
        break;
      case 'JoinOurmailingList':
        this._router.navigate(['/JoinOurmailingList']).then(() => {
          console.log("Navigated to 'JoinOurmailingList'");
          location.reload();
        });
        break;
      case 'Photos':
        this._router.navigate(['/Photos']).then(() => {
          console.log("Navigated to 'Photos'");
          location.reload();
        });
        break;
      case 'speaker-registration':
        this._router.navigate(['/speaker-registration']).then(() => {
          console.log("Navigated to 'speaker-registration'");
          location.reload();
        });
        break;
      case 'speaker':
        this._router.navigate(['/speaker']).then(() => {
          console.log("Navigated to 'speaker'");
          location.reload();
        });
        break;
      case 'pastspeakers':
        this._router.navigate(['/pastspeakers']).then(() => {
          console.log("Navigated to 'pastspeakers'");
          location.reload();
        });
        break;
      case 'agenda':
        this._router.navigate(['/agenda']).then(() => {
          console.log("Navigated to 'agenda'");
          location.reload();
        });
        break;
      case 'WhoShouldAttend':
        this._router.navigate(['/WhoShouldAttend']).then(() => {
          console.log("Navigated to 'WhoShouldAttend'");
          location.reload();
        });
        break;

      case 'EventPartners':
        this._router.navigate(['/EventPartners']).then(() => {
          console.log("Navigated to 'EventPartners'");
          location.reload();
        });
        break;

      case 'MediaPartners':
        this._router.navigate(['/MediaPartners']).then(() => {
          console.log("Navigated to 'MediaPartners'");
          location.reload();
        });
        break;

      case 'DownloadCenter':
        this._router.navigate(['/DownloadCenter']).then(() => {
          console.log("Navigated to 'DownloadCenter'");
          location.reload();
        });
        break;
      // Add more cases for other routes as needed
    }
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
