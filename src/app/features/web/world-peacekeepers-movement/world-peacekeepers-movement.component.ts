import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControlName,
  FormBuilder,
  FormArray,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import html2canvas from 'html2canvas';
import int1TelInput from 'intl-tel-input';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';
import { DatePipe, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-world-peacekeepers-movement',
  templateUrl: './world-peacekeepers-movement.component.html',
  styleUrls: ['./world-peacekeepers-movement.component.css'],
})
export class WorldPeacekeepersMovementComponent implements OnInit {
  peacekeepersForm: any = FormGroup;
  reqBody: any;
  formdisplay: boolean = true;
  showPopup: boolean = false;
  isPeaceOn: number = -1;
  display: string = '';
  code: any;
  submitted = false;
  is_selectedFile: boolean = false;
  countryData: any;
  fileUrl: any;
  isMobile: any;
  mobile_number: string = '';
  mobile_numberVal: boolean = false;

  selectedFile: File | null = null;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  defaultCountryISO: any;
  selectedCountryISO: any;
  peacekeeperData: any = [];
  peacekeeperBadgeId: any;
  peacekeeperBadgeResponse: any;
  peacekeeperBadge: any;
  isCheckEmail: boolean = true;
  previewUrl: string | null = null; // Add this to your component

  isMobileView = false;
  // qrCodeData: string  = 'delegate-registration?code=CODZDZ-0000063-W';
  qrCodeData: string | null = null;
  qrCodeImg: any;
  convertedImage: string | null = null;
  isConvertedImage: boolean = true;
  minDate: string | null = null;
  maxDate: string | null = null;
  isDragging = false;
  imageChangedEvent: any = '';
  imageFileName: any = '';
  croppedImage: any = '';
  zoomLevel: number = 1; // Initial zoom level
  transform: ImageTransform = {}; // Object for applying transformations
  disabledDates: Date[] = [];
  formattedDate: string = '';
  maxDate1 : any;
  minDate1 : any;
  colorTheme: string = 'theme-dark-blue';
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  onCountryChange(event: any): void {
    console.log('Country Changed:', event); // Logs the selected country
    this.selectedCountryISO = event.iso2; // Update the selected country ISO
  }
  // configOption: ConfigurationOptions = new ConfigurationOptions;

  constructor(private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private DelegateService: DelegateService,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.defaultCountryISO = CountryISO.UnitedArabEmirates;
    // this.is_selectedFile = false;
    
    const today = new Date();

    // Max date is 18 years ago from today
    this.maxDate1 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  
    // Min date is 120 years ago from today
    this.minDate1 = new Date(today.getFullYear() - 120, 0, 1);
  }

  getcontrol(name: any): AbstractControl | null {
    return this.peacekeepersForm.get(name);
  }
  get f() {
    return this.peacekeepersForm.controls;
  }
  @ViewChild('contentTemplate')
  contentTemplate!: TemplateRef<any>;

  country_code_val() {
    console.log(
      this.peacekeepersForm.value.phone.number,
      this.peacekeepersForm.value.dialCode
    );
  }

  ngOnInit(): void {
    // this.setMetaTags();
    // this.setCanonicalUrl(
    //   'https://www.justice-love-peace.com/world-peacekeepers-movement'
    // );
    this.dobValidator();
    console.log(
      this.mobile_numberVal,
      this.is_selectedFile,
      this.peacekeepersForm.invalid
    );

    this.checkWindowSize();
    this.getAllCountrycode();
    this.mobile_numberVal = false;
    const inputElement = document.getElementById('phone') as HTMLInputElement;
    console.log(inputElement, 'inputElement');

    if (inputElement) {
      const data = int1TelInput(inputElement, {
        initialCountry: 'ae',
        separateDialCode: true,
        utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js',
      });
      inputElement.addEventListener('countrychange', () => {
        console.log(data);

        this.countryData = int1TelInput(inputElement, {
          initialCountry: 'ae',
          separateDialCode: true,
          utilsScript:
            'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js',
        }).getSelectedCountryData();
        console.log('Selected Country Code:', this.countryData.dialCode);
        console.log('Selected Country ISO Code:', this.countryData.iso2);
      });
    }

    this.peacekeepersForm = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      dob: ['', [Validators.required,this.ageValidator]],
      country: ['', [Validators.required]],
      country_code: [''],
      mobile_number: [
        '',
        [
          Validators.required,
          // Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
          this.noRepeatingDigits(),
          this.containsConsecutiveZeros(),
        ],
      ],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      is_active: 1,
      Check_email: [''],
      // File: ['', [Validators.required]],
    });
  }

  containsConsecutiveZeros(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && /000000/.test(value)) {
        return { containsConsecutiveZeros: true };
      }
      return null;
    };
  }

  noRepeatingDigits(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && value.length === 10) {
        // Check for repeating digits
        const repeatingDigits = /(.)\1{5,}/.test(value);
        if (repeatingDigits) {
          return { repeatingDigits: true };
        }
      }
      return null;
    };
  }


dobValidator() {
  const today = new Date();

  // Calculate the date 18 years ago from today
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  this.maxDate = eighteenYearsAgo.toISOString().split('T')[0]; // Max date = 18 years ago
  this.minDate = `${today.getFullYear() - 120}-01-01`; // Min date = 120 years ago

  // Set disabledDates (any date after maxDate)
  this.disabledDates = [eighteenYearsAgo]; // Disabling the date of 18 years ago
  console.log(`Max date (18 years ago): ${this.maxDate}`);
}

ageValidator(control: FormControl) {
  const selectedDate = new Date(control.value);

  // If the selected date is invalid, return an error
  if (isNaN(selectedDate.getTime())) {
    return { invalidDate: true }; // Invalid date format
  }

  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  // If selected date is after or on the date 18 years ago, it's invalid
  if (selectedDate > eighteenYearsAgo) {
    return { ageError: 'Date must be at least 18 years ago' };
  }

  return null; // Valid date
}
disableManualInput(event: KeyboardEvent): void {
  event.preventDefault();
}

onDateChange(event: string): void {
  // Convert the date format
  const parsedDate = new Date(event);
  this.formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

}

  get dob() {
    return this.peacekeepersForm.get('dob');
  }

  downloadImage() {
    if (this.convertedImage) {
      const link = document.createElement('a');
      link.href = this.convertedImage;
      link.download = 'peacekeeper-card.png'; // Set the filename
      link.click();
    }

    // const element: HTMLElement | null = document.getElementById('capture');
    // if (!element) {
    //   console.error('Element not found for capturing!');
    //   return;
    // }

    // html2canvas(element, {
    //   useCORS: true, // Ensures cross-origin images are captured
    //   scale: 2,    // Improves image quality
    // })
    //   .then((canvas) => {
    //     const imageUrl = canvas.toDataURL('image/png');
    //     // const link = document.createElement('a');
    //     // link.href = imageUrl;
    //     // link.download = 'peacekeeper-card.png'; // Set the filename
    //     // link.click();
    //   })
    //   .catch((error) => {
    //     console.error('Error capturing the image:', error);
    //   })
    //   .finally(() => {
    //     // this.isLoading = false; // Hide the spinner if added
    //     this.display = "none";
    //     this.showPopup = false;
    //   });
    setTimeout(() => {
      this.display = 'none';
      this.showPopup = false;
    }, 1000);
  }
  openPopup() {
    // this.peacekeeperBadgeId = 124
    if (this.peacekeeperBadgeId) {
      let id = this.peacekeeperBadgeId;
      this.DelegateService.getPeacekeeper_Badge(id).subscribe((res: any) => {
        this.peacekeeperData = res.data;
        this.qrCodeImg = res.QR_code;
        this.fileUrl = this.peacekeeperData.file_urls[0];
        console.log('modal peacekeeperData', this.peacekeeperData);
        setTimeout(() => {
          this.readyImage();
        }, 1000);
      });
    }

    this.showPopup = true;
    this.isPeaceOn = 0;
    this.display = 'block';
    this.formdisplay = false;
  }
  readyImage() {
    if (this.peacekeeperData) {
      const element: HTMLElement | null = document.getElementById('capture');
      if (!element) {
        console.error('Element not found for capturing!');
        return;
      }

      html2canvas(element, {
        useCORS: true, // Ensures cross-origin images are captured
        scale: 2, // Improves image quality
      })
        .then((canvas) => {
          this.convertedImage = canvas.toDataURL('image/png');
          // const link = document.createElement('a');
          // link.href = this.convertedImage;
          // link.download = 'peacekeeper-card.png'; // Set the filename
          // link.click();
        })
        .catch((error) => {
          console.error('Error capturing the image:', error);
        })
        .finally(() => {
          // this.isLoading = false; // Hide the spinner if added
          console.log('converted image', this.convertedImage);
          this.isConvertedImage = false;
        });
    }
  }
  closeModal() {
    this.display = 'none';
    this.showPopup = false;
  }
  isCorrect() {
    this.isMobile =
      this.peacekeepersForm.value.mobile_number.dialCode +
      ' ' +
      this.peacekeepersForm.value.mobile_number.number;
    this.display = 'block';
    this.showPopup = true;
    this.isPeaceOn = 1;
  }
  getAllCountrycode() {
    this.DelegateService.getAllCountrycode().subscribe(
      (res: any) => {
        // debugger;
        console.log('code', res.data);
        this.code = res.data;
        // Define the country name you want to find (e.g., "India (+91)")
        const countryToFind = 'India';

        // Find the object that matches the country name
        // const indiaCodeObject =  this.code.find((item:any) => item.name === countryToFind);
        // console.log(indiaCodeObject);

        //     this.peacekeepersForm.patchValue({
        //       country :indiaCodeObject.name
        //     })
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }
  // profile_picture:[''],

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      

      if (file) {
        const validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
        const minSize = 204800; // 200KB
        const maxSize = 5242880; // 5MB
        
        // Validate the file type
        if (!validExtensions.includes(file.type)) {
          this.SharedService.ToastPopup('', 'Invalid file type! Please select a JPG or PNG file.', 'error')
          
          this.is_selectedFile = false;
          return;
        }
              // Validate the file size
      if (file.size < minSize || file.size > maxSize) {
        this.SharedService.ToastPopup('', 'Invalid file size! Please select an image between 200KB to 5MB.', 'error');
        this.is_selectedFile = false;
        return;
      }
      }
      else {
        console.log('No file selected.');
      }
      
      this.selectedFile = event.dataTransfer.files[0];
      this.is_selectedFile = true;
      this.imageFileName = this.selectedFile.name;
      console.log('Dropped file:', this.selectedFile);

      // Update the input field's value programmatically
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(this.selectedFile);
        fileInput.files = dataTransfer.files; // Set the dropped file to the input
      }

      const fileInputEvent = {
        target: {
          files: [this.selectedFile],
        },
      } as any;
      this.fileChangeEvent(fileInputEvent);
      console.log(this.peacekeepersForm);
    }

  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;

    // Add a visual cue for the drag-over state (e.g., border highlight)
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    // Remove the visual cue for the drag-over state
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent, 'on select');
    // Open the popup for cropping
    this.isPeaceOn = 2;
    this.showPopup = true;
    this.display = 'block';
    this.formdisplay = false;
  }

  // Handle the file selection from the input element
  onFileSelect(event: Event): void {
    console.log(
      this.mobile_numberVal,
      this.is_selectedFile,
      this.peacekeepersForm.invalid
    );

    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.is_selectedFile = true;

      console.log('Selected file:', this.selectedFile);
    }
  }

  
  onFileChange(event: any): void {
    
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent, 'on select');
    this.imageFileName = event.target.files[0].name;
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
      const minSize = 204800; // 200KB
      const maxSize = 5242880; // 5MB

      // Validate the file type
      if (!validExtensions.includes(file.type)) {
        this.SharedService.ToastPopup('', 'Invalid file type! Please select a JPG or PNG file.', 'error')
        event.target.value = ''; // Reset the file input
        this.is_selectedFile = false;
        return;
      }
          // Validate the file size
    if (file.size < minSize || file.size > maxSize) {
      this.SharedService.ToastPopup('', 'Invalid file size! Please select an image between 200KB to 5MB.', 'error');
      event.target.value = ''; // Reset the file input
      this.is_selectedFile = false;
      return;
    }

      this.isPeaceOn = 2;
      this.showPopup = true;
      this.display = 'block'
      this.formdisplay = false;

    }
    else {
      console.log('No file selected.');
    }



    // console.log(this.mobile_numberVal, this.is_selectedFile, this.peacekeepersForm.invalid);

    // const file = event.target.files[0];
    // if (file) {
    //   this.selectedFile = file;
    //   this.is_selectedFile = true;
    // }
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this.previewUrl = e.target.result; // Set the preview URL
    // };
    // reader.readAsDataURL(file);
    // console.log('Selected file:', this.selectedFile);
  }

  //   fileChangeEvent(event: any): void {
  //     this.imageChangedEvent = event;
  // }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;
    console.log(this.imageFileName, 'cropping');

    // Assuming 'event.objectUrl' is the Blob URL returned from the cropper
    fetch(this.croppedImage)
      .then((response) => response.blob()) // Fetch the image blob
      .then((blob) => {
        // Create a File object from the Blob
        const file = new File([blob], this.imageFileName, {
          type: blob.type,
          lastModified: Date.now(), // You can set this to the actual last modified timestamp if needed
        });

        // Now you can append the file data to your payload
        const payload = {
          file: file,
          otherData: 'your other data here',
        };

        // For example, logging the file details
        console.log(file);
        console.log(payload);

        const newFile = file;
        if (newFile) {
          this.selectedFile = newFile;
          this.is_selectedFile = true;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result; // Set the preview URL
        };
        reader.readAsDataURL(newFile);
        console.log('Selected file:', this.selectedFile);

        // Proceed with your request or any other operation with 'payload'
      })
      .catch((error) => {
        console.error('Error fetching the image:', error);
      });
  }

  closeImageModal() {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fileInput.value = '';
    this.is_selectedFile = false;
    this.display = 'none';
    this.showPopup = false;
    this.selectedFile = null;
  }

  imageLoaded() {
    // Optional: Image loaded event
  }

  cropperReady() {
    this.imageChangedEvent = '';
    this.display = 'none';
    this.showPopup = false;
    // Optional: Cropper ready event
  }

  // Zoom In
  zoomIn(): void {
    if (this.zoomLevel < 5) {
      // Maximum zoom level
      this.zoomLevel += 0.1;
      this.applyZoom();
    }
  }

  // Zoom Out
  zoomOut(): void {
    if (this.zoomLevel > 1) {
      // Minimum zoom level
      this.zoomLevel -= 0.1;
      this.applyZoom();
    }
  }

  // Apply Zoom
  applyZoom(): void {
    this.transform = {
      ...this.transform,
      scale: this.zoomLevel, // Apply zoom level
    };
  }

  loadImageFailed() {
    // Optional: Image load failed event
  }

  ValidateAlpha(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;

    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }

  extractCountryCode(inputString: string): string | null {
    const countryCodeMatch = inputString.match(/\(\+(\d+)\)/);
    return countryCodeMatch ? `+${countryCodeMatch[1]}` : null;
  }

  submitData(fileInput: HTMLInputElement): void {
    this.convertedImage = '';
    this.display = 'none';
    this.showPopup = false;
    console.log(
      this.peacekeepersForm.value.mobile_number.number,
      this.peacekeepersForm.value.mobile_number.dialCode
    );

    // const inputString = this.peacekeepersForm.value.country_code;
    // const countryCode = this.extractCountryCode(inputString);
    // console.log(countryCode); // Output: +91
    const returnmobileNumber = this.peacekeepersForm.value.mobile_number;
    const returnDOB = this.peacekeepersForm.value.dob;
    console.log(returnmobileNumber,'mobileNumber');

    const rawMobileNumber = this.peacekeepersForm.value.mobile_number.number;
    const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces
    console.log(formattedMobileNumber);

    this.isCheckEmail = this.peacekeepersForm.value.Check_email;
    this.peacekeepersForm.patchValue({
      is_active: 1,
      Check_email: this.peacekeepersForm.value.Check_email == true ? 1 : 0,
      // country_code: this.peacekeepersForm.value.mobile_number.countryCode,
      mobile_number:
        this.peacekeepersForm.value.mobile_number.dialCode +
        ' ' +
        formattedMobileNumber,
        dob: this.formattedDate

    });
    console.log(this.peacekeepersForm.value);
    // if (this.peacekeepersForm.invalid) {
    //   return console.log('Invalid Details');
    // }

    // Create FormData object
    const formData = new FormData();

    // Append all form fields except the file
    Object.keys(this.peacekeepersForm.value).forEach((key) => {
      formData.append(key, this.peacekeepersForm.value[key]);
    });

    // Append the selected file
    if (this.selectedFile) {
      formData.append(
        'profile_picture',
        this.selectedFile,
        this.selectedFile.name
      );
    }
    console.log('this.peacekeepersForm', formData);
    console.log('window.location.origin', environment.domainUrl);
    formData.append('url', environment.domainUrl);

    // Show loader
    this.ngxService.start();

    // Call the service to submit data
    this.SharedService.postPeacekeeper(formData).subscribe(
      (response: any) => {
        if (response.success) {
          this.submitted = true;
          this.ngxService.stop();
          console.log('response', response);
          // this.peacekeeperBadgeResponse = response.QR_code
          this.peacekeeperBadgeResponse =
            'https://devglobaljusticeapis.cylsys.com/uploads/delegates/COIEIE-0000069-W.png';
          this.peacekeeperBadge = response.batch;

          this.peacekeeperBadgeId = response.peacekeeper_id;
          this.SharedService.ToastPopup('', response.message, 'success');
          this.is_selectedFile = false;
          this.peacekeepersForm.reset();

          this.selectedFile = null;
          fileInput.value = '';
          this.previewUrl = '';
        } else {
          this.ngxService.stop();
          this.SharedService.ToastPopup('', response.message, 'error');
        }
      },
      (err) => {
          this.peacekeepersForm.patchValue({
          mobile_number: returnmobileNumber,
          dob: returnDOB,
        });
        this.ngxService.stop();

        this.SharedService.ToastPopup('', err.error.message, 'error');
      }
    );
  }

  keyPressNumbers(event: KeyboardEvent, inputValue: any) {
    //
    if (inputValue !== null) {
      if (inputValue.number.length < 7) {
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
    }
  }

  onKeyDown(event: KeyboardEvent, inputValue: any): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
    }
  }

  onMobileKeyDown(event: KeyboardEvent, inputValue: any): void {
    // Check if the pressed key is the space bar and the input is empty
    if (inputValue !== null) {
      if (event.key === ' ' && inputValue.trim() === '') {
        event.preventDefault(); // Prevent the space character from being typed
      } else if (event.code === 'Backspace') {
        if (inputValue.number.length < 7) {
          this.mobile_numberVal = true;
          // event.preventDefault()
          
        } else {
          console.log('form',this.peacekeepersForm.controls['mobile_number'].errors?.validatePhoneNumber['valid']);
          this.mobile_numberVal = false;
        }
      }
    }
  }

  /** ✅ Function to Display Validation Message */
  getPhoneErrorMessage() {
    const control = this.peacekeepersForm.controls['mobile_number'];
    
    if (control.errors.validatePhoneNumber['valid']) {
      return '';
    } else {
      return 'Invalid mobile number for selected country.';
    }
  }


  getCountrycode(code: any) {
    let countryName = this.peacekeepersForm.value.country;
    const indiaCodeObject = code.find((item: any) => item.name === countryName);
    console.log(indiaCodeObject);

    this.peacekeepersForm.patchValue({
      // is_active :1,
      // Check_email:this.peacekeepersForm.value.Check_email == true? 1 : 0,
      country_code: indiaCodeObject.code,
      // mobile_number: this.peacekeepersForm.value.mobile_number.dialCode + ' ' + formattedMobileNumber
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
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

  downloadQRCode(parent: any) {
    //
    console.log(parent);

    let parentElement = null;

    if (parent.elementType === 'canvas') {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector('canvas')
        .toDataURL('image/png');
    } else if (this.qrCodeData === 'img' || this.qrCodeData === 'url') {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector('img').src;
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.");
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement);
      // saves as image
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // name of the file
      link.download = 'qrcode';
      link.click();
    }
  }

  private convertBase64ToBlob(Base64Image: any) {
   
    const parts = Base64Image.split(';base64,');

    const imageType = parts[0].split(':')[1];
  
    const decodedData = window.atob(parts[1]);
 
    const uInt8Array = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }


  onInput(event: any, controlName: string) {
    const trimmedValue = event.target.value.replace(/^\s+/, ''); // Remove leading spaces
    this.peacekeepersForm.controls[controlName].setValue(trimmedValue, { emitEvent: false });
  }

  // setMetaTags(): void {
  //   this.titleService.setTitle(
  //     'World Peacekeepers Movement | Global Justice, Love, and Peace Initiative | Dubai'
  //   );

  //   this.metaService.addTags([
  //     {
  //       name: 'description',
  //       content:
  //         'Join the World Peacekeepers Movement, a global initiative forming the worlds largest peace army to promote justice, love, and harmony. JOIN US AS A PEACEKEEPER NOW and make a difference in creating a peaceful world.',
  //     },
  //     {
  //       name: 'keywords',
  //       content:
  //         'Become a peacekeeper, Dubai Peace Summit 2025, Global Justice Summit Dubai, Global peace efforts, Global Peace Summit Dubai 2025, Join the peace movement, Justice and equality events, Love and Peace Summit, Peace summit registration, Promoting equality and compassion, Register for the summit, Social harmony projects, World peace movement, World Peacekeepers Summit',
  //     },
  //     {
  //       property: 'og:title',
  //       content:
  //         'World Peacekeepers Movement | Global Justice, Love, and Peace Initiative | Dubai',
  //     },
  //     {
  //       property: 'og:description',
  //       content:
  //         'Join the World Peacekeepers Movement, a global initiative forming the worlds largest peace army to promote justice, love, and harmony. JOIN US AS A PEACEKEEPER NOW and make a difference in creating a peaceful world.',
  //     },
  //     {
  //       property: 'og:image',
  //       content:
  //         'http://www.justice-love-peace.com/assets/UIComponents/images/logo.jpg',
  //     },
  //     {
  //       property: 'og:url',
  //       content: 'https://www.justice-love-peace.com/world-peacekeepers-movement',
  //     },
  //     {
  //       property: 'og:type',
  //       content: 'website',
  //     },
  //     {
  //       property: 'og:site_name',
  //       content: 'Global Justice, Love and Peace Summit | Dubai',
  //     },
  //   ]);
  // }

  // setCanonicalUrl(url: string): void {
  //   const existingLink: HTMLLinkElement | null = this.document.querySelector(
  //     'link[rel="canonical"]'
  //   );
  //   if (existingLink) {
  //     this.renderer.removeChild(this.document.head, existingLink);
  //   }

 
  //   const link: HTMLLinkElement = this.renderer.createElement('link');
  //   this.renderer.setAttribute(link, 'rel', 'canonical');
  //   this.renderer.setAttribute(link, 'href', url);
  //   this.renderer.appendChild(this.document.head, link);
  // }
}