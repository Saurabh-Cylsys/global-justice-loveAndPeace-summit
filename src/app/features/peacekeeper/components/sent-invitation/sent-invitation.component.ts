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
    this.editor = new Editor();
    this.editorForm = this.fb.group({
      text :[ '']
    });

    this.checkWindowSize();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  this.isCollapsed = false;
   this.isMobileView = false;

  }


  onRecipientChange(option: any) {
    console.log(option);
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
    console.log(evt.target.value);

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

  @ViewChild('shareBtn') shareBtn!: ElementRef;


  ngAfterViewInit(): void {
    this.shareBtn.nativeElement.addEventListener('click', this.shareContent.bind(this));
  }

  shareContent(): void {
    if (navigator.share) {
      navigator.share({
        title: 'GeeksForGeeks',
        url: 'https://geeksforgeeks.org'
      })
      .then(() => console.log('Thanks for sharing!'))
      .catch(err => console.error('Error while using Web Share API:', err));
    } else {
      alert("Browser doesn't support this API!");
    }
  }
}
