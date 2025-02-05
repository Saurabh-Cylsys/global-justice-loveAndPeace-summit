import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';

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

  constructor(private fb: FormBuilder) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation(); // Prevent conflicts
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();

    this.editorForm = this.fb.group({
      text :[ '']
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  selectedRecipient: string = 'Select';
  selectedSendVia: string = 'Select';
  selectedSendViaImage: string | null = null;

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

  submit() {
    console.log(this.form.value);
  }
}
