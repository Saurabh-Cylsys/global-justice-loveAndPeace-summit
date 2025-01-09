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
      "Name": "Arjuna Ranatunga, Deshamanya",
      "Country": "SRI LANKA",
      "Credentials": "Cricketer & Politician"
    },
    {
      "S_No": 2,
      "Name": "Banagala Upatissa Thero, Most Venerable ",
      "Country": "SRI LANKA",
      "Credentials": "President of Mahabodhi Society, Sri Lanka : Buddhist Religious Leader"
    },
    {
      "S_No": 3,
      "Name": "Binod Kumar Chaudhary  ",
      "Country": "NEPAL",
      "Credentials": "President, Chaudhary Group : Industrialist, Member of House of Representatives of Nepal"
    },
    {
      "S_No": 4,
      "Name": "Chandra Kumar Bose ",
      "Country": "INDIA",
      "Credentials": "Socio-Political Activist & Convenor, The Open Platform for Netaji : ( grand nephew of Subhash Chandra Bose ) "
    },
    {
      "S_No": 5,
      "Name": "Dalip Singh Rana, The Great Khali",
      "Country": "USA, INDIA",
      "Credentials": "Wrestler : 1st Indian born World Heavyweight Champion, WWE"
    },
    {
      "S_No": 6,
      "Name": "Ekaterina Zagladina",
      "Country": "RUSSIA ",
      "Credentials": "President of the Permanent Secretariat of the World Summit of Nobel Peace Laureates"
    },
    {
      "S_No": 7,
      "Name": "Esha Deol",
      "Country": "INDIA ",
      "Credentials": "Actress"
    },
    {
      "S_No": 8,
      "Name": "Feizi Masrour Milani, Dr.",
      "Country": "BRAZIL",
      "Credentials": "Elected Representative, National Spiritual Assembly of the Bahais of Brazil"
    },
    {
      "S_No": 9,
      "Name": "Habil Khorakiwala, Dr.",
      "Country": "INDIA",
      "Credentials": "Industrialist : Chairman, Wockhardt Group"
    },
    {
      "S_No": 10,
      "Name": "Helena Lemaletian, Senator, Ambassador",
      "Country": "KENYA",
      "Credentials": "Politician ( Member of Parliament ), Royalty ( Queen of the North Kenya ), Beauty Queen ( Miss Commonwealth Kenya, 2018 )"
    },
    
    {
      "S_No": 11,
      "Name": "Kailash Satyarthi",
      "Country": "INDIA",
      "Credentials": "Social Activist, Nobel Peace Laureate 2014"
    },
    {
      "S_No": 12,
      "Name": "Lech Walesa, Ex-President",
      "Country": "POLAND",
      "Credentials": "Politician, Trade Union Activist : Nobel Peace Laureate 1983"
    },
    {
      "S_No": 13,
      "Name": "Leymah Gbowee",
      "Country": "LIBERIA",
      "Credentials": "Nobel Peace Laureate 2011"
    },
    {
      "S_No": 14,
      "Name": "Lokesh Ji Muni Acharya, His Holiness",
      "Country": "INDIA",
      "Credentials": "Founder, Ahimsa Vishwa Bharti & World Peace Ambassador, Jain Religion Spiritual Leader"
    },
    {
      "S_No": 15,
      "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
      "Country": "BURKINA FASO",
      "Credentials": "Head of Association of Judges of 8 countries in West Africa"
    },
    {
      "S_No": 16,
      "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
      "Country": "DENMARK",
      "Credentials": "Royalty, TV Host, Philanthropist"
    },
    {
      "S_No": 17,
      "Name": "Mary Kom",
      "Country": "INDIA",
      "Credentials": "Boxer, 6 times World Champion"
    },
    {
      "S_No": 18,
      "Name": "Mohammed Abd-Salam, His Excellency, Judge",
      "Country": "EGYPT",
      "Credentials": "Secretary General of the Muslim Council of Elders & Co-President of Religions for Peace"
    },
    {
      "S_No": 19,
      "Name": "Mohammed Asif Ali, Nawabzada",
      "Country": "INDIA",
      "Credentials": "Royalty Heir Apparent to the Prince of Arcot"
    },
    {
      "S_No": 20,
      "Name": "Mohan Mubasinghe, Prof",
      "Country": "SRI LANKA",
      "Credentials": "Nobel Peace Laureate 2007"
    },
    {
      "S_No": 21,
      "Name": "Mustapha Njie",
      "Country": "GAMBIA",
      "Credentials": "Industrialist : Chairman, TAF Global"
    },
    {
      "S_No": 22,
      "Name": "Nadia Murad",
      "Country": "IRAQ",
      "Credentials": "Social Activist : Nobel Peace Laureates 2018"
    },
    {
      "S_No": 23,
      "Name": "Nadir Godrej",
      "Country": "INDIA",
      "Credentials": "Industrialist, Chairman, Godrej Industries"
    },
    {
      "S_No": 24,
      "Name": "Oheneba Nana Kwame Obeng 2, His Royal Highness",
      "Country": "GHANA",
      "Credentials": "Royalty, The Royal House of Sefwi Obeng-Mim"
    },
    {
      "S_No": 25,
      "Name": "Ouided Bouchamaoui",
      "Country": "TUNISIA",
      "Credentials": "Nobel Peace Laureate 2015"
    },
    {
      "S_No": 26,
      "Name": "Paco Soleil",
      "Country": "SPAIN",
      "Credentials": "Artist, Peace Painter (live performance)"
    },
    {
      "S_No": 27,
      "Name": "P V Sindhu",
      "Country": "INDIA",
      "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
    },
    {
      "S_No": 28,
      "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
      "Country": "MADAGASCAR",
      "Credentials": "Royalty, Pastor, Philanthropist"
    },
    {
      "S_No": 29,
      "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
      "Country": "MALAYSIA",
      "Credentials": "Royalty, Philanthropist, Peace Activist"
    },
    {
      "S_No": 30,
      "Name": "Rui Duarte de Barros, His Excellency",
      "Country": "GUINEA BISSAU",
      "Credentials": "Prime Minister"
    },
    {
      "S_No": 31,
      "Name": "Satpal Singh Khalsa, Bhai Saheb",
      "Country": "USA",
      "Credentials": "Ambassador of Sikh Dharma"
    },
    {
      "S_No": 32,
      "Name": "Shirin Ebadi",
      "Country": "IRAN",
      "Credentials": "Social Activist, Judge, Lawyer : Nobel Peace Laureate 2003"
    },
    {
      "S_No": 33,
      "Name": "Tehemton  Burjor Mirza, Dastur",
      "Country": "INDIA",
      "Credentials": "High Priest, Shreeji Pak Iranshah Atash Behram, Udvada : Zoroastrian Religion Leader"
    },
    {
      "S_No": 34,
      "Name": "Thich Nhat Tu, Most Venerable, Dr.",
      "Country": "VIETNAM",
      "Credentials": "Vice-President, Vietnam Buddhist Sangha & Permanent Vice-Chancellor, Vietnam Buddhist Society : Buddhist Religion Leader"
    },
    {
      "S_No": 35,
      "Name": "Venkatramani R, Honorable",
      "Country": "INDIA",
      "Credentials": "The Attorney General of India"
    },
    {
      "S_No": 36,
      "Name": "Yasmin Karachiwala",
      "Country": "INDIA",
      "Credentials": "Celebrity Fitness Trainer"
    },
    {
      "S_No": 37,
      "Name": "Zayed Khan",
      "Country": "INDIA",
      "Credentials": "Producer & Actor"
    }
  ]

  joinOnline: any[] = [
    {
      "S_No": 1,
      "Name": "Jose Manuel Ramos Horta, His Excellency",
      "Country": "EAST TIMOR",
      "Credentials": "President, East Timor & Nobel Peace Laureate, 1996 (ONLINE)"
    },
  ]
  
  
  // headerIcon:any
  constructor(private _router: Router,private _activeRouter:ActivatedRoute, private SharedService: SharedService, private cdr: ChangeDetectorRef
  ) {}
  events = [
    { title: 'Registration', time: '10:00 AM - 10:30 AM' },
    { title: 'Opening Session', time: '10:30 AM - 11:00 AM' },
    { title: 'Session Theme 1 - JUSTICE', time: '11:00 AM - 12:30 PM' },
    { title: 'Lunch & Networking', time: '12:30 PM - 2:30 PM' },
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