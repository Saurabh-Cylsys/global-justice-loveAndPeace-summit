import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DelegateService } from '../../delegate/services/delegate.service';
import {ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-the-summit',
  templateUrl: './the-summit.component.html',
  styleUrls: ['./the-summit.component.css']
})
export class TheSummitComponent implements OnInit{
  isMobileView = false;

  events = [
    { title: 'Registration', time: '10:00 AM - 10:30 AM' },
    { title: 'Opening Session', time: '10:30 AM - 11:00 AM' },
    { title: 'Session Theme 1 - JUSTICE', time: '11:00 AM - 12:30 PM' },
    { title: 'Launch & Networking', time: '12:30 PM - 2:30 PM' },
    { title: 'Session Theme 2 - LOVE', time: '2:30 PM - 4:00 PM' },
  ];

  speakers: any;

  constructor(
    private formBuilder: FormBuilder,
     private DelegateService: DelegateService,
     private SharedService: SharedService, 
     private ngxService: NgxUiLoaderService, 
     private ActivatedRoute: ActivatedRoute,
     private router: Router) {

   }
   ngOnInit(): void {
    this.checkWindowSize();

    this.getInviteSpeakers()
   }
    getInviteSpeakers(){
    this.DelegateService.getSpeakers().subscribe((res: any) => {
      console.log("speakers", res.data);
      this.speakers =res.data;
    }, (err:any) => {
      console.log("error", err);
    });
  }

  downloadPDF() {
    debugger
    const fileUrl = 'assets/UIComponents/files/GJLPS-Collateral-Brochure.pdf'; // Path to your PDF file in the assets folder
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'GJLPS-Collateral-Brochure.pdf'; // Name of the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
