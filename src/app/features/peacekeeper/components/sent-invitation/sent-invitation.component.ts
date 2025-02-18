import {
  ChangeDetectionStrategy,} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sent-invitation',
  templateUrl: './sent-invitation.component.html',
  styleUrls: ['./sent-invitation.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SentInvitationComponent implements OnInit {
  isNew: boolean = false;
  isExisting: boolean = false;
  isEditorVisible: boolean = true;
  form!: FormGroup;
  text :string ="";
  userData: any;

  htmlContent: string = ''; // Store HTML content

  editor!: Editor;

  editorForm! : FormGroup;
  isCollapsed! : boolean;
  isMobileView! : boolean

  selectedRecipient: string = 'Select';
  selectedSendVia: string = 'Select';
  selectedSendViaImage: string | null = null;
  sanitizedContent: SafeHtml = ''

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef,
    private SharedService: SharedService, private sanitizer: DomSanitizer){
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  get textValue() {
    return this.editorForm.get('text')?.value;
  }

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }]
    ]
  };


  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  recipientOptions = [
    {
      label: 'Contact',
      image: 'assets/UIComponents/images/peacekeeper/image 2650.jpg',
    },
    {
      label: 'Peace Partners',
      image: 'assets/UIComponents/images/peacekeeper/peace.png',
    },
    {
      label: 'Delegates',
      image: 'assets/UIComponents/images/peacekeeper/delegate.png',
    },
    {
      label: 'Patrons',
      image: 'assets/UIComponents/images/peacekeeper/Patrons.png',
    },
    {
      label: 'Collaborators',
      image: 'assets/UIComponents/images/peacekeeper/Collaborators.png',
    },
  ];


  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation(); // Prevent conflicts
    }
  }

   // Listen to window resize events
   @HostListener('window:resize', ['$event'])
   onResize(event: any): void {
     this.checkWindowSize();
   }

  ngOnInit(): void {
    // this.editor = new Editor();
    // this.editorForm = this.fb.group({
    //   text :[ '']
    // });

    this.userData = JSON.parse(localStorage.getItem('userDetails') || '');
    this.checkWindowSize();
  }

  // ngOnDestroy(): void {
  //   this.editor.destroy();
  //   this.isCollapsed = false;
  //   this.isMobileView = false;
  // }

  onRecipientChange(option: any) {
    this.selectedRecipient = option.label;
  }

  sendViaOptions = [
    {
      label: 'Email',
      image: 'assets/UIComponents/images/peacekeeper/Email.png',
    },
    {
      label: 'WhatsApp',
      image: 'assets/UIComponents/images/peacekeeper/WhatsApp.png',
    },
    { label: 'SMS', image: 'assets/UIComponents/images/peacekeeper/SMS.png' },
  ];

  onSendViaChange(option: any) {
    this.selectedSendVia = option.label;
    this.selectedSendViaImage = option.image;
  }

  changeTemplateType(evt: any) {

    if (evt.target.value == 1) {
      this.isNew = true;
      this.isExisting = false;
    } else if (evt.target.value == 2) {
      this.isNew = false;
      this.isExisting = true;
    }
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

  submit() {
    console.log(this.form.value);
  }

  getSanitizedHTML(): SafeHtml {
    let rawHTML = this.editorForm.get('text')?.value || '';

    // Mark the content as safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(rawHTML);
  }


  // shareContent(event: Event): void {

  //   event.preventDefault(); // Ensure it's within a user gesture


  //   if (navigator.share) {
  //     navigator.share({
  //       title: 'Global Justice, Love and Peace Summit | Dubai',
  //       url: this.userData.qr_code
  //     })
  //     .then(() => console.log('Thanks for sharing!'))
  //     .catch(err => {
  //       if (err.name === 'AbortError') {
  //         console.warn('User canceled the sharing action.');
  //       } else {
  //         console.error('Error while using Web Share API:', err);
  //       }
  //     });
  //   } else {
  //     this.SharedService.ToastPopup("Your browser doesn't support the Web Share API.",'','error');
  //   }
  // }


  shareContent(): void {

    // Ensure that userData.qr_code is available
    if (!this.userData?.qr_code && !this.userData?.QR_CODE) {
      this.SharedService.ToastPopup("QR Code URL is missing.", '', 'error');
      return;
    }

    // const shareTitle = 'Global Justice, Love and Peace Summit | Dubai';
    // const shareURL = this.userData.qr_code;

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

 ${this.userData.qr_code || this.userData.QR_CODE}

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

}
