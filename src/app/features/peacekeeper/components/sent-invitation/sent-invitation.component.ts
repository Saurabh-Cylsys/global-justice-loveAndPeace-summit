import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { AngularEditorComponent, AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-sent-invitation',
  templateUrl: './sent-invitation.component.html',
  styleUrls: ['./sent-invitation.component.css']
})
export class SentInvitationComponent implements OnInit ,AfterViewInit{

  isNew: boolean = false;
  isExisting: boolean = false;
  isCollapsed = false;
  isMobileView = false;
  constructor(private cdr: ChangeDetectorRef, private SharedService: SharedService){
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  ngOnInit(): void {
    this.checkWindowSize();
  }

  selectedRecipient: string = 'Select';
  selectedSendVia: string = 'Select';
  selectedSendViaImage: string | null = null;

  @ViewChild('editorWrapper', { static: false }) editorWrapper!: ElementRef;
  @ViewChild('htmlEditor',{ static: false }) htmlEditor!: AngularEditorComponent;
  @Output() htmlContentChanged: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('editor') editor!: ElementRef;
  htmlContent : string = "";
  @ViewChild('titleInput') titleInput!: ElementRef;



  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '10rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    sanitize: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    defaultFontSize: '4px',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],

    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  recipientOptions = [
    { label: 'Contact', image: 'assets/UIComponents/images/peacekeeper/image 2650.jpg' },
    { label: 'Peace Partners', image: 'assets/UIComponents/images/peacekeeper/peace.png' },
    { label: 'Delegates', image: 'assets/UIComponents/images/peacekeeper/delegate.png' },
    { label: 'Patrons', image: 'assets/UIComponents/images/peacekeeper/Patrons.png' },
    { label: 'Collaborators', image: 'assets/UIComponents/images/peacekeeper/Collaborators.png' }
  ];


  onRecipientChange(option: any) {
    console.log(option);
    this.selectedRecipient = option.label;
  }

  sendViaOptions = [
    { label: 'Email', image: 'assets/UIComponents/images/peacekeeper/Email.png' },
    { label: 'WhatsApp', image: 'assets/UIComponents/images/peacekeeper/WhatsApp.png' },
    { label: 'SMS', image: 'assets/UIComponents/images/peacekeeper/SMS.png' }
  ];

  onSendViaChange(option: any) {
    this.selectedSendVia = option.label;
    this.selectedSendViaImage = option.image;
  }

  changeTemplateType(evt:any){

    const selectedValue = (evt.target as HTMLSelectElement).value;
    this.isNew = selectedValue === '1'; // Enable new template

    setTimeout(() => this.adjustEditorHeight(), 500);

    // if(evt.target.value == 1) {
    //   this.isNew = true;
    //   this.isExisting = false;
    // }
    // else if(evt.target.value == 2) {
    //   this.isNew = false;
    //   this.isExisting = true;
    // }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.adjustEditorHeight(), 1000);
  }

  onHtmlContentChanged(content: string): void {

    setTimeout(() => this.adjustEditorHeight(), 300);
  }

  // private adjustEditorHeight(): void {
  //   if (this.editor && this.htmlEditor.textArea) {
  //     const editorElement = this.htmlEditor.textArea.nativeElement;
  //     editorElement.style.height = 'auto';
  //     editorElement.style.height = `${editorElement.scrollHeight}px`;

  //     this.cdr.detectChanges();
  //   }
  // }

  private adjustEditorHeight(): void {
    if (this.editorWrapper?.nativeElement) {
      const editorElement = this.editorWrapper.nativeElement;

      // Avoid infinite update loop
      const newHeight = editorElement.scrollHeight + 'px';
      if (editorElement.style.height !== newHeight) {
        editorElement.style.height = 'auto';
        editorElement.style.height = newHeight;
        this.cdr.detectChanges();
      }
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
        // Listen to window resize events
        @HostListener('window:resize', ['$event'])
        onResize(event: any): void {
          this.checkWindowSize();
        }
}

