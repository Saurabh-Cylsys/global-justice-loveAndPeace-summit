import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

declare var AOS: any;

@Component({

  selector: 'app-web-home',

  templateUrl: './web-home.component.html',



  styleUrls: ['./web-home.component.css']

})



export class WebHomeComponent implements OnInit, OnDestroy{
  targetDate: Date = new Date('2025-04-13T08:00:00'); // Replace with your target date
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  private timerInterval: any;
  isMobileView = false;

  data: any[] = [
    {
      "S_No": 1,
      "Name": "Habil Khorakiwala, Dr.",
      "Country": "INDIA",
      "Credentials": "Industrialist : Chairman, Wockhardt Group"
    },
    {
      "S_No": 2,
      "Name": "Kailash Satyarthi",
      "Country": "INDIA",
      "Credentials": "Social Activist, Nobel Peace Laureate 2014"
    },
    {
      "S_No": 3,
      "Name": "Leymah Gbowee",
      "Country": "LIBERIA",
      "Credentials": "Nobel Peace Laureate 2011"
    },
    {
      "S_No": 4,
      "Name": "Lokesh Ji Muni Acharya, His Holiness",
      "Country": "INDIA",
      "Credentials": "Jain religion spiritual leader"
    },
    {
      "S_No": 5,
      "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
      "Country": "BURKINA FASO",
      "Credentials": "Head of Association of Judges of 8 countries in West Africa"
    },
    {
      "S_No": 6,
      "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
      "Country": "DENMARK",
      "Credentials": "Royalty, TV Host, Philanthropist"
    },
    {
      "S_No": 7,
      "Name": "Mary Kom",
      "Country": "INDIA",
      "Credentials": "Boxer, 6 times World Champion"
    },
    {
      "S_No": 8,
      "Name": "Nadir Godrej",
      "Country": "INDIA",
      "Credentials": "Industrialist, Chairman, Godrej Industries"
    },
    {
      "S_No": 9,
      "Name": "Ouided Bouchamaoui",
      "Country": "TUNISIA",
      "Credentials": "Nobel Peace Laureate 2015"
    },
    {
      "S_No": 10,
      "Name": "Paco Soleil",
      "Country": "SPAIN",
      "Credentials": "Artist, Peace Painter (live performance)"
    },
    {
      "S_No": 11,
      "Name": "P V Sindhu",
      "Country": "INDIA",
      "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
    },
    {
      "S_No": 12,
      "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
      "Country": "MADAGASCAR",
      "Credentials": "Royalty, Pastor, Philanthropist"
    },
    {
      "S_No": 13,
      "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
      "Country": "MALAYSIA",
      "Credentials": "Royalty, Philanthropist, Peace Activist"
    },
    {
      "S_No": 14,
      "Name": "Rui Duarte de Barros, His Excellency",
      "Country": "GUINEA BISSAU",
      "Credentials": "Prime Minister"
    },
    {
      "S_No": 15,
      "Name": "Satpal Singh Khalsa, Bhai Saheb",
      "Country": "USA",
      "Credentials": "Ambassador of Sikh Dharma"
    }
  ]
  
  
  // headerIcon:any
  constructor(private _router: Router,private _activeRouter:ActivatedRoute, private SharedService: SharedService, private cdr: ChangeDetectorRef
  ) {}
  events = [
    { title: 'Registration', time: '10:00 AM - 10:30 AM' },
    { title: 'Opening Session', time: '10:30 AM - 11:00 AM' },
    { title: 'Session Theme 1 - JUSTICE', time: '11:00 AM - 12:30 PM' },
    { title: 'Launch & Networking', time: '12:30 PM - 2:30 PM' },
    { title: 'Session Theme 2 - LOVE', time: '2:30 PM - 4:00 PM' },
  ];
  ngOnInit(): void {
    this.checkWindowSize();
    AOS.init({

      duration: 1200,

    })

    console.log("home");

   this.SharedService.headerIcon =  this._router.routerState.snapshot.url;

   this.updateCountdown();
    this.timerInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);

  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }




  toggle() {

    this._router.navigateByUrl('/aboutUs');

  }


  downloadPDF() {
    
    const fileUrl = 'assets/UIComponents/files/GJLPS-Collateral-Brochure.pdf'; // Path to your PDF file in the assets folder
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'GJLPS-Collateral-Brochure.pdf'; // Name of the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }



  navigate() {

    console.log("del");

    this._router.navigate(['/delegate-registration'])

    // this._router.navigate[('/delegate-registration')];



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

  private updateCountdown(): void {

    const now = new Date().getTime();

    // Adjust current time to Dubai UTC-1.5
    const dubaiTimeOffset = 1.5 * 60 * 60 * 1000; // Dubai is UTC-1.5
    const dubaiNow = now - dubaiTimeOffset;
  
    const targetDate = this.targetDate.getTime();
    const timeDifference = targetDate - dubaiNow;


    
    // const now = new Date().getTime();
    
    // const targetDate = this.targetDate.getTime();
    // const timeDifference = targetDate - now;

    if (timeDifference > 0) {
      this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    } else {
      this.days = this.hours = this.minutes = 0;
    }

    // console.log('Countdown:', { days: this.days, hours: this.hours, minutes: this.minutes });
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this._activeRouter.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}