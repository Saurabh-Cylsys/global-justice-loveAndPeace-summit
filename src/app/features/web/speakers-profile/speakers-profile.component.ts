import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { WebService } from '../webz-services/web.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-speakers-profile',
  templateUrl: './speakers-profile.component.html',
  styleUrls: ['./speakers-profile.component.css']
})
export class SpeakersProfileComponent implements OnInit {
  speakersDetails: any[] = [];
  speakersId: any;
  speakersName: any = '';
  isLoading = true;
 totalColor :  any[] = [];
  tinyURL : string = environment.tinyUrl;

  constructor(
    private webService: WebService,
    private datePipe: DatePipe,
    private _sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }
  
  

  

  ngOnInit(): void {
    this.getrandomcolor(10)


    this.route.params.subscribe((params: any) => {
      console.log("Params", params);
      if (params != undefined && Object.keys(params).length > 0) {

        this.speakersId = params.speakerId
        this.speakersName = params.speakerName

      }
    });


    this.loadSpeakers()


  }

  
  getrandomcolor(length:any) {
    let letters = '0123456789ABCDEF';
  
    for (let i = 0; i < length; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }    this.totalColor.push(color);
    }
  
    console.log(this.totalColor);
  }

  loadSpeakers() {
    this.isLoading = true;

    // Prepare the search text - if country is selected, include it in the search

    this.webService.getSpeakersList('', '73', this.speakersId)
      .subscribe({

        next: (response: any) => {
          if (response?.data) {
            this.speakersDetails = response?.data;
            this.speakersDetails[0].speaker_details = JSON.parse(this.speakersDetails[0].speaker_details)
            this.speakersDetails[0].qr_code =  this.speakersDetails[0].url
            console.log(this.speakersDetails, 'list of speakers');


            // this.speakersDetails[0].speaker_details = this.transformSpeakerData(this.speakersDetails[0].speaker_details);
            // this.speakersDetails[0].speaker_details = [...this.speakersDetails[0].speaker_details];

          } else {
            this.speakersDetails = [];

          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching speakers:', error);
          this.isLoading = false;
          this.speakersDetails = [];
        }
      });
  }
 
  private transformSpeakerData(data:any): any[] {
    // Group speakers into chunks of 4 speakers per group
    const groupSize = 2;
    const groups = [];
    
    for (let i = 0; i < data.length; i += groupSize) {
      groups.push({
        details: data.slice(i, i + groupSize)
      });
    }
    
    return groups;
  }

  navigateUrl() {
     const tinyUrlWithParams = `${this.speakersDetails[0].url}`;
    // const tinyUrlWithParams = `${'https://tinyurl.com/3322sj49'}`;  //for local testing only
        window.location.href = tinyUrlWithParams;

  }

  copyInputMessage(inputElement: HTMLInputElement) {
    if (inputElement && inputElement.value) {
      navigator.clipboard.writeText(inputElement.value).then(() => {
        this._sharedService.ToastPopup("Copied to clipboard!", "", "success");
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    }
  }

  shareContent(): void {

    // Ensure that speakersDetails.qr_code is available
    if (!this.speakersDetails[0].url && !this.speakersDetails[0].QR_CODE) {
      this._sharedService.ToastPopup("QR Code URL is missing.", '', 'error');
      return;
    }

    // const shareTitle = 'Global Justice, Love and Peace Summit | Dubai';
    // const shareURL = this.speakersDetails.qr_code;

    const shareTitle = `
    *✨ 12 REASONS TO ATTEND GLOBAL JUSTICE, LOVE & PEACE SUMMIT AT DUBAI ON 12, 13 APRIL, 2025 ✨*

👑 *Chief Guest:* His Excellency Sheikh Nahayan Mabarak Al Nahayan, Minister of Tolerance & Co-Existence, UAE

🌍 *Chairman of the Summit:* Dr. Huzaifa Khorakiwala

🌟 *A STAR-STUDDED, SENSITIVE, SPECIAL, SOCIABLE, SAGACIOUS, SWEET, & SATISFYING Summit!*

🎤 *1. OUTSTANDING, GLOBAL SPEAKERS* 🎓🌎
72 outstanding, global speakers including *10 Nobel Peace Laureates* 🕊️ (including *Lech Walesa*), *Baba Ramdev*, *Sri Sri Ravishankar* (live online), *Jacqueline Fernandez*, *The Great Khali*, etc.

🌐 *2. 2800 DELEGATES (PEACEKEEPERS)* 🤝💙
Surely, one of the world’s *largest private summits* on *justice, love, & peace*, a great place to *network* with *noble & noteworthy Delegates (Peacekeepers).*

📅 *3. PEACE NETWORKING* 🤲📍
*28 Peace Networking Tables* to do *private networking* by fixing up *meetings before the event* with Delegates of your choice.

🏅 *4. PAX AWARDS* 🎖️✨
*28 Awards* amongst *112 nominees* at a *glittering Awards ceremony.*

🍛 *5. PEACE MENU* 🌍🍽️
*28 dishes* from *28 different countries* in an exotic *Peace Menu* over 1 meal, so with *2 Lunches & 2 Dinners*, there will be *112 dishes from 28 countries!*

📸 *6. PRIVATE PHOTOS WITH SPEAKERS* 📷✨
Each Speaker agrees to take *individual, private pictures* with *28 Delegates*—you could be *one of them!*

🥇 *7. INVITATION TO EXCLUSIVE VIP LUNCHES & DINNERS* 🏆🍴
*12%* of Delegates will get a *Special Invite* to a *VIP Lunch or Dinner* where *Speakers & Awardees* are likely to be present. Hence, *48%* of Delegates will receive an invite to *one of the 4 Lunches or Dinners.*

🎁 *8. PEACE GIFTS* 🎀📦
Every Delegate will receive *exquisite Peace Gifts*, which include a *Peace Calendar*, *Peace Coffee Mug*, *Peace Chocolates*, etc.

🎭 *9. SPEAKERS CUT-OUTS* 🖼️📷
Each Delegate can *take photos* with *Speakers’ Cut-Outs!*

✊ *10. I AM PEACEKEEPER MOVEMENT* ✨🫶
Become part of a *Global “I am Peacekeeper” Movement* & network with *Global Peacekeepers* while receiving *attractive offers & discounts!*

👗 *11. PEACE FASHION* 🌎🧵
See a *unique Peace Fashion Show* featuring *7 leading fashion designers* from different continents.

🎼 *12. PEACE SONGS* 🎶🎙️
Experience *inspiring Peace Songs* live!

🚀 *SOME OCCASIONS & EXPERIENCES ARE JUST NOT TO BE MISSED*

_"where every smile counts"_ 😊✨

📢 *Register as a DELEGATE (Peacekeeper) through my personal link below & get 7% discount on the Summit Pass of $2800.*

 ${this.speakersDetails[0].url || this.speakersDetails[0].QR_CODE}

📞 *Summit Helpline* ☎️
INTERNATIONAL : +971543257125
INDIA : 18002672828

🌐 www.justice-love-peace.com
`
    // Construct WhatsApp Share URL
    // const whatsappURL = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareURL}`;

    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareTitle)}`;
    // const teamsURL = `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(shareTitle)}`;


    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        text: shareTitle
      })
      .then(() => console.log('Thanks for sharing!'))
      .catch(err => {
        if (err.name === 'AbortError') {
          console.warn('User canceled the sharing action.');
        } else {
          console.error('Error while using Web Share API:', err);
        }
      });
    } else {
      // Open WhatsApp in a new tab for users without Web Share API support
      window.open(whatsappURL, '_blank');
    }
  }
  ngOnDestroy(): void {
    
  }
}
