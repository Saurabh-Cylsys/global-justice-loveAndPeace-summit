import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { DelegateService } from '../../services/delegate.service';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';
import {
  CountryISO,
  NgxIntlTelInputComponent,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-delegate-with-child',
  templateUrl: './delegate-with-child.component.html',
  styleUrls: ['./delegate-with-child.component.css']
})
export class DelegateWithChildComponent {

  showPopup: boolean = false;
  formdisplay: boolean = true;
  display: string = '';
  reqBody: any;
  registrationForm: any = FormGroup;
  submitted = false;
  countryData: any = [];
  statesData: any = [];
  cityData: any = [];
  code: any;
  mobile_number: string = '';
  mobile_numberVal: boolean = false;
  fullURL: string;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  selectedCountryISO: any;
  formattedDate: string = '';
  referralCode: any = '';
  minDate: string | null = null;
  maxDate: string | null = null;
  isMobileView = false;
  interests = [
    { value: 'Justice', label: 'Justice' },
    { value: 'Love', label: 'Love' },
    { value: 'Peace', label: 'Peace' },
  ];
  disabledDates: Date[] = [];

  maxDate1: any;
  minDate1: any;
  colorTheme: string = 'theme-dark-blue';
  country_name: any;
  state_name: any;
  city_name: any;
  @ViewChild('number_mobile1', { static: false }) mobileNumberInput!: ElementRef;
  @ViewChild('dobPicker') dobPicker!: BsDatepickerDirective;
  ipAddress: string = "";
  deviceInfo: any = "";
  isOTPReceive: boolean = false;
  txtVerifyOTP : string = ""
  countdown: number = 100; // 5 minutes in seconds
  timerExpired: boolean = false;
  interval: any;
  buttonText :string = 'Send OTP'
  nominateChild: string = '';
  nomineeName: string = '';
  nomineeDob: string = '';
  nomineeEmail: string = '';
  nomineeRelation: string = '';
  relationData : any = [];
  instituteName : string =""
  delegateId: any;
  nomineeAge: number = 0;
  userAge : number = 0;
  nominee_mobile_number : any = "";
  userType: string = '';
  showNomineeForm: boolean = false;
  userDob: string = "";
  nomineeFormattedDate: string = "";
  today = new Date();


  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  onCountryChange(event: any): void {
    this.selectedCountryISO = event.iso2; // Update the selected country ISO
  }

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private delegateService: DelegateService,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer : Renderer2
  ) {
    this.fullURL = window.location.href;

  }

  getcontrol(name: any): AbstractControl | null {
    return this.registrationForm.get(name);
  }

  get instagramProfileControl() {
    return this.registrationForm.get('instagram_profile');
  }

  isInvalidInstagramProfile() {
    return (
      this.instagramProfileControl.hasError('pattern') &&
      this.instagramProfileControl.touched
    );
  }

  get f() {
    return this.registrationForm.controls;
  }

  ngOnInit(): void {
    this.checkWindowSize();
    // this.dobValidator();

    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.referralCode = params.code;
      }
      if (this.referralCode) {
        console.log(this.referralCode, 'referralCode..........');
      }
    });

    this.createForm();

    // this.getdates()
    this.getAllCountries();
    // this.getAllCountrycode()
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      country_code: [''],
      mobile_number: ['', [Validators.minLength(7), Validators.required]],
      email_id: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      linkedIn_profile: [''],
      instagram_profile: [''],
      profession_1: ['', [Validators.required]],
      profession_2: [''],
      website: ['', [Validators.pattern('^(https?:\\/\\/)?([\\w.-]+)\\.([a-z]{2,6})([\\/\\w .-]*)*\\/?$')]],
      organization_name: [''],
      address: [''],
      country: ['', [Validators.required]],
      state: ['',[Validators.required]],
      city: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      passport_no: [''],
      passport_issue_by: [''],
      pin_code: [null],
      reference_no: [this.referralCode ? this.referralCode : ''],
      attendee_purpose: ['0', [Validators.required]],
      conference_lever_interest: [[], [Validators.required]], // Initialize as empty array
      created_by: 'Admin',
      status: ['0'],
    });
  }



  isDisabledDate(date: Date): boolean {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return date >= eighteenYearsAgo;
  }

  onCheckboxChange(event: any) {
    const conferenceLeverInterest = this.registrationForm.get(
      'conference_lever_interest'
    );
    if (conferenceLeverInterest) {
      const currentValues = conferenceLeverInterest.value || [];
      if (event.target.checked) {
        // Add the value if checked
        conferenceLeverInterest.setValue([
          ...currentValues,
          event.target.value,
        ]);
      } else {
        // Remove the value if unchecked
        conferenceLeverInterest.setValue(
          currentValues.filter((v: string) => v !== event.target.value)
        );
      }
      conferenceLeverInterest.markAsTouched(); // Mark control as touched
    }
  }

  disableManualInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  getAllCountrycode() {
    this.delegateService.getAllCountrycode().subscribe(
      (res: any) => {
        this.code = res.data;
        // Define the country name you want to find (e.g., "India (+91)")
        const countryToFind = 'India (+91)';

        // Find the object that matches the country name
        const indiaCodeObject = this.code.find(
          (item: any) => item.country_mobile_code === countryToFind
        );

        this.registrationForm.patchValue({
          country_code: indiaCodeObject.country_mobile_code,
        });
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  // onDateChange(event: string): void {

  //   if (!event) return;

  // const dob = new Date(event);
  // const today = new Date();

  // let age = today.getFullYear() - dob.getFullYear();
  // const monthDiff = today.getMonth() - dob.getMonth();
  // const dayDiff = today.getDate() - dob.getDate();

  // if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
  //   age--;
  // }

  //   this.nomineeAge = age;
  //   const parsedDate = new Date(event);
  //   this.formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  // }

  onDateChange(event: string, field: 'dob' | 'nomineeDob'): void {
    if (!event) return; // Handle empty date input

    const dob = new Date(event);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }


    if (field === 'dob') {
      this.userAge = age;
      this.userDob = event;
      console.log("User Age:", this.userAge);
    } else if (field === 'nomineeDob') {
      this.nomineeAge = age;
      this.nomineeDob = event;
      console.log("Nominee Age:", this.nomineeAge);
    }

    // Perform validation check
    this.validateAges(field);

    const parsedDate = new Date(event);
    // const formattedDate = this.datePipe.transform(dob, 'yyyy-MM-dd') || '';
    this.formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

    this.nomineeFormattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

  }

  validateAges(field: string): void {
    if (this.userType === 'student') {
      if ( this.userAge >= 21) {
        this.SharedService.ToastPopup('As a Student, your age must be less than 21.', '', 'error');
        return;
      }
      if (this.nomineeAge <= 21) {
        this.SharedService.ToastPopup('Your nominee must be older than 21.', '', 'error');
        return;
      }
    } else if (this.userType === 'adult') {
      if (this.userAge < 21) {
        this.SharedService.ToastPopup('As an Adult, your age must be 21 or older.', '', 'error');
        return;
      }
      if (this.nomineeAge >= 21) {
        this.SharedService.ToastPopup('Your nominee must be younger than 21.', '', 'error');
        return;
      }
    }
  }

  getAllCountries() {
    this.delegateService.getAllCountries().subscribe(
      (res: any) => {
        this.countryData = res.data;
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  changeCountry(e: any) {

    const selectedValue = e.target.value;
    const countryObj = JSON.parse(selectedValue); // Convert JSON string back to object
    this.registrationForm.patchValue({ country_id: countryObj.id });
    this.country_name = countryObj.name;

      this.ngxService.start();
      this.delegateService.getAllStates(countryObj.id).subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.statesData = res.data;
        },
        (err: any) => {
          console.log('Err', err);
          // this.ngxService.stop();
        }
      );
  }

  changeStates(e: any) {

    const selectedValue = e.target.value;
    const stateObj = JSON.parse(selectedValue); // Convert JSON string back to object
    this.registrationForm.patchValue({ state_id: stateObj.id });
    this.state_name = stateObj.name;

    // this.ngxService.start();
    this.delegateService.getAllCities(stateObj.id).subscribe((res: any) => {
      // this.ngxService.stop();
      this.cityData = res.data;
    });
  }

  changeCity(e: any) {
      const selectedValue = e.target.value;
      const cityObj = JSON.parse(selectedValue); // Convert JSON string back to object
      this.registrationForm.patchValue({ city_id: cityObj.id });
      this.city_name = cityObj.name;
  }

  keyPressNumbers(event: KeyboardEvent, inputValue: any) {
    if (inputValue !== null) {
      if (inputValue.number.length < 7) {
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Block pasting
    const text = event.clipboardData?.getData('text') || '';

    // Allow only alphabets and spaces
    const allowedPattern = /^[a-zA-Z\s\-_‘]$/;
    if (allowedPattern.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append only valid text
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }

  onPasteMobileNumber(event: ClipboardEvent) {
    event.preventDefault(); // Block default paste action
    const text = event.clipboardData?.getData('text') || '';

    // Allow only numbers (0-9)
    if (/^\d+$/.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append only valid numbers
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }

  onEmailPaste(event: ClipboardEvent) {
    event.preventDefault(); // Block default paste action
    const text = event.clipboardData?.getData('text') || '';

    // Allow only valid email characters (a-z, A-Z, 0-9, @, ., _, -)
    if (/^[a-zA-Z0-9@._-]+$/.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append only valid characters
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }

  onProfessionPaste(event: ClipboardEvent) {
    event.preventDefault(); // Prevent default paste action
    const text = event.clipboardData?.getData('text') || ''; // Get the pasted text

    const validTextPattern = /^[a-zA-Z\s_@&-]*$/;

    // If valid, allow paste; otherwise, show an alert or handle accordingly
    if (validTextPattern.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value = text; // Paste valid text into the input field
      input.dispatchEvent(new Event('input')); // Trigger input event to update Angular form control
    }
    else {
      event.preventDefault();
    }
  }

  onProfessionInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Remove leading spaces
    let inputValue = input.value.replace(/^\s+/, '');

    // Allow alphabets, _, @, &, -, and spaces (but no special characters other than these)
    inputValue = inputValue.replace(/[^a-zA-Z_@&-\s]/g, '');

    // Prevent multiple spaces
    inputValue = inputValue.replace(/\s{2,}/g, ' ');

    // Set the cleaned value back to the input field
    this.registrationForm.controls['profession_1'].setValue(inputValue, { emitEvent: false });
}

onProfession2Input(event: Event) {
  const input = event.target as HTMLInputElement;

  // Remove leading spaces
  let inputValue = input.value.replace(/^\s+/, '');

  // Allow alphabets, _, @, &, -, and spaces (but no special characters other than these)
  inputValue = inputValue.replace(/[^a-zA-Z_@&-\s]/g, '');

  // Prevent multiple spaces
  inputValue = inputValue.replace(/\s{2,}/g, ' ');

  // Set the cleaned value back to the input field
  this.registrationForm.controls['profession_2'].setValue(inputValue, { emitEvent: false });
}

  validateAlpha(event: any) {
    const allowedPattern = /^[a-zA-Z\s\-'_‘]$/;

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }

  validateAddress(event: KeyboardEvent) {
    const allowedPattern = /^[a-zA-Z0-9\s@,.\-_()]*$/;

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }

  validateWebsite(event: any) {
    const allowedPattern = /^[a-zA-Z0-9@._\-/:]+$/;

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }


  onPasteAddress(event: ClipboardEvent) {
    event.preventDefault(); // Block default paste action
    const text = event.clipboardData?.getData('text') || '';

    // Allow only letters, numbers, spaces, and specific special characters
    const allowedPattern = /^[a-zA-Z0-9\s@,.\-_()]+$/;

    if (allowedPattern.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append valid text
      input.dispatchEvent(new Event('input')); // Trigger input event to update Angular form control
    } else {
      this.SharedService.ToastPopup("Only letters, numbers, spaces, and @, . - _ ( ) are allowed.",'',"error");
    }
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

  getPhoneErrorMessage() {
    const control = this.registrationForm.controls['mobile_number'];
    if (control.value) {
      if (control.errors.validatePhoneNumber['valid']) {
        return '';
      } else {
        return 'Invalid mobile number for selected country.';
      }
    }
    return '';
  }

  onMobileKeyDown(event: KeyboardEvent, inputValue: any): void {
    if (inputValue !== null) {
      // Prevent space at the beginning
      if (event.key === ' ' && event.code === 'Space' && inputValue.number.length === 0) {
        event.preventDefault();
        return;
      }

      // Allow only numbers, Backspace, Delete, Arrow Keys, and Tab
      if (!/^[0-9]$/.test(event.key) &&
          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
        event.preventDefault();
        return;
      }

      // Handle backspace validation
      if (event.code === 'Backspace') {
        if (inputValue.number.length < 7) {
          this.mobile_numberVal = true;
        } else {
          this.mobile_numberVal = false;
        }
      }
    }
  }


  onKeyDown(event: KeyboardEvent, fieldType: 'email' | 'website' | 'linkedin'): void {
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      return; // Allow these keys
    }

    if (event.key === ' ' && event.code === 'Space') {
      event.preventDefault(); // Prevent leading spaces
      return;
    }

    let allowedPattern: RegExp;
    switch (fieldType) {
      case 'email':
        allowedPattern = /^[a-zA-Z0-9@._-]$/; // Allowed characters for email
        break;
      case 'website':
        allowedPattern = /^[a-zA-Z0-9.:/_-]$/; // Allowed characters for website
        break;
      case 'linkedin':
        allowedPattern = /^[a-zA-Z0-9.:/_%+-]$/; // Allows LinkedIn profile URLs (including % for encoding)
        break;
      default:
        return;
    }

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }

  onInputEvent(event: KeyboardEvent | ClipboardEvent, fieldType: 'email' | 'website' | 'linkedin'): void {
    if (event.type === 'paste') {
      // Handle paste event
      event.preventDefault();
      const clipboardData = (event as ClipboardEvent).clipboardData?.getData('text') || '';

      let allowedPattern: RegExp;
      switch (fieldType) {
        case 'email':
          allowedPattern = /^[a-zA-Z0-9@._-]+$/; // Allowed characters for email
          break;
        case 'website':
          allowedPattern = /^[a-zA-Z0-9.:/_-]+$/; // Allowed characters for website
          break;
        case 'linkedin':
          allowedPattern = /^[a-zA-Z0-9.:/_%+-]+$/; // Allows LinkedIn profile URLs (including % for encoding)
          break;
        default:
          return;
      }

      if (allowedPattern.test(clipboardData)) {
        const input = event.target as HTMLInputElement;
        input.value += clipboardData; // Append valid text
        input.dispatchEvent(new Event('input')); // Update Angular form control
      } else {
        alert('Invalid characters pasted.');
      }
      return;
    }

    // Handle keydown event
    const keyEvent = event as KeyboardEvent;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(keyEvent.key)) {
      return; // Allow these keys
    }

    if (keyEvent.key === ' ' && keyEvent.code === 'Space') {
      keyEvent.preventDefault(); // Prevent leading spaces
      return;
    }

    let allowedPattern: RegExp;
    switch (fieldType) {
      case 'email':
        allowedPattern = /^[a-zA-Z0-9@._-]$/;
        break;
      case 'website':
        allowedPattern = /^[a-zA-Z0-9.:/_-]$/;
        break;
      case 'linkedin':
        allowedPattern = /^[a-zA-Z0-9.:/_%+-]$/;
        break;
      default:
        return;
    }

    if (!allowedPattern.test(keyEvent.key)) {
      keyEvent.preventDefault(); // Block invalid characters
    }
  }


  onPasteEvent(event: ClipboardEvent, fieldType: 'website' | 'linkedin'): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';

    let allowedPattern: RegExp;
    switch (fieldType) {
      case 'website':
        allowedPattern = /^[a-zA-Z0-9.:/_-]+$/;
        break;
      case 'linkedin':
        allowedPattern = /^[a-zA-Z0-9.:/_%+-]+$/;
        break;
      default:
        return;
    }

    if (allowedPattern.test(clipboardData)) {
      const input = event.target as HTMLInputElement;
      input.value += clipboardData; // Append valid text
      input.dispatchEvent(new Event('input')); // Update Angular form control
    } else {
      event.preventDefault();
    }
  }


  onInstagramKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event instanceof KeyboardEvent) {
      // Block spaces at the beginning
      if (event.key === ' ' && input.value.length === 0) {
        event.preventDefault();
        return;
      }

      // Allow only letters, numbers, underscores, and dots
      const allowedKeys = /^[a-zA-Z0-9_.]$/;
      if (event.key.length === 1 && !allowedKeys.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  onInstagramPaste(event: ClipboardEvent) {
    event.preventDefault(); // Block pasting

    const text = event.clipboardData?.getData('text') || '';
    const validText = text.replace(/[^a-zA-Z0-9_.]/g, ''); // Remove invalid characters

    if (validText !== text) {
      event.preventDefault();
    }

    const input = event.target as HTMLInputElement;
    input.value = validText; // Only paste valid characters
    input.dispatchEvent(new Event('input')); // Trigger Angular change detection
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelectorAll('input').forEach((input) => {
        input.setAttribute('autocomplete', 'off');
      });
    });
  }

  submitData(): void {

    if (!this.userDob || !this.nomineeDob) {
      this.SharedService.ToastPopup('Please select both DOB fields.', '', 'error');
      return;
    }

    // Ensure both ages are defined before proceeding
    if (this.userAge === undefined || this.nomineeAge === undefined) {
      this.SharedService.ToastPopup('Invalid date selection. Please enter valid DOBs.', '', 'error');
      return;
    }

    if (this.userType === 'student') {
      if (this.userAge >= 21) {
        this.SharedService.ToastPopup('As a Student, your age must be less than 21.', '', 'error');
        return;
      }
      if (this.nomineeAge <= 21) {
        this.SharedService.ToastPopup('Your nominee must be older than 21.', '', 'error');
        return;
      }
    } else if (this.userType === 'adult') {
      if (this.userAge < 21) {
        this.SharedService.ToastPopup('As an Adult, your age must be 21 or older.', '', 'error');
        return;
      }
      if (this.nomineeAge >= 21) {
        this.SharedService.ToastPopup('Your nominee must be younger than 21.', '', 'error');
        return;
      }
    }

    if(this.nomineeName.length < 2  || this.nomineeName == undefined) {
      this.SharedService.ToastPopup("Nominee Name must be 2 characters long.", '', 'error');
      return;
    }

    if(this.nomineeDob == "" || this.nomineeDob == undefined) {
      this.SharedService.ToastPopup("Please select Nominee Nominee DOB", '', 'error');
      return;
    }
    else if(this.nomineeEmail == "" || this.nomineeEmail == undefined) {
      this.renderer.selectRootElement('#nomineemail').focus();
      this.SharedService.ToastPopup("Please Enter Email ID",'','error');
      return;
    }
    // else if (this.nomineeEmail.invalid) {
    //   this.renderer.selectRootElement('#nomineemail').focus();
    //   this.SharedService.ToastPopup('Please enter a valid Email ID', '', 'error');
    //   return;
    // }
    else if(this.nominee_mobile_number == "" || this.nominee_mobile_number == undefined || this.nominee_mobile_number == null) {
      setTimeout(() => {
        const inputElement = document.querySelector('#nominee_mobile_number input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error("Could not find mobile number input field");
        }
      }, 100);

      this.SharedService.ToastPopup("Please Enter  Mobile Number",'','error');
      return;
    }
    // else if (this.nominee_mobile_number.errors && !nominee_mobile_number.errors?.validatePhoneNumber?.valid) {
    //   setTimeout(() => {
    //     const inputElement = document.querySelector('#nominee_mobile_number input') as HTMLInputElement;
    //     if (inputElement) {
    //       inputElement.focus();
    //     } else {
    //       console.error("Could not find mobile number input field");
    //     }
    //   }, 100);

    //   this.SharedService.ToastPopup("Please enter a valid mobile number for the selected country",'','error');
    //   return;
    // }

    if(!this.registrationForm.value.title || this.registrationForm.value.title.length < 2){
      this.renderer.selectRootElement('#title').focus();
      this.SharedService.ToastPopup("Title must be at least 2 characters long.", '', 'error');
      return;
    }
    else if(!this.registrationForm.value.first_name || this.registrationForm.value.first_name.length < 3) {
      this.renderer.selectRootElement('#f_name').focus();
      this.SharedService.ToastPopup("First Name must be at least 3 characters long.", '', 'error');
      return;
    }
    else if(!this.registrationForm.value.last_name || this.registrationForm.value.last_name.length < 2) {
      this.renderer.selectRootElement('#l_name').focus();
      this.SharedService.ToastPopup("Last Name must be at least 3 characters long.", '', 'error');
      return;
    }
    else if(this.registrationForm.value.dob == "" || this.registrationForm.value.dob == undefined) {
      this.renderer.selectRootElement('#dob').focus();
      this.SharedService.ToastPopup("Please Select Date Of Birth",'','error');
      return;
    }
    else if(this.registrationForm.value.mobile_number == "" || this.registrationForm.value.mobile_number == undefined || this.registrationForm.value.mobile_number == null) {
      setTimeout(() => {
        const inputElement = document.querySelector('#number_mobile1 input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error("Could not find mobile number input field");
        }
      }, 100);

      this.SharedService.ToastPopup("Please Enter  Mobile Number",'','error');
      return;
    }
    else if (this.registrationForm.controls['mobile_number'].errors && !this.registrationForm.controls['mobile_number'].errors?.validatePhoneNumber?.valid) {
      setTimeout(() => {
        const inputElement = document.querySelector('#number_mobile1 input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error("Could not find mobile number input field");
        }
      }, 100);

      this.SharedService.ToastPopup("Please enter a valid mobile number for the selected country",'','error');
      return;
    }
    else if(this.registrationForm.value.email_id == "" || this.registrationForm.value.email_id == undefined) {
      this.renderer.selectRootElement('#email').focus();
      this.SharedService.ToastPopup("Please Enter Email ID",'','error');
      return;
    }
    else if (this.registrationForm.controls['email_id'].invalid) {
      this.renderer.selectRootElement('#email').focus();
      this.SharedService.ToastPopup('Please enter a valid Email ID', '', 'error');
      return;
    }
    else if(!this.registrationForm.value.profession_1 || this.registrationForm.value.profession_1.trim().length < 2) {
      this.renderer.selectRootElement('#profession1').focus();
      this.SharedService.ToastPopup("Profession must be at least 2 characters long.", '', 'error');
      return;
    }
    else if(this.country_name == "" || this.country_name == undefined) {

      setTimeout(() => {
        const countryElement = this.renderer.selectRootElement('#country', true);
        if (countryElement) {
          countryElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup("Please Select Country",'','error');
      return;
    }
    else if(this.state_name == "" || this.state_name == undefined) {
      setTimeout(() => {
        const stateElement = this.renderer.selectRootElement('#state', true);
        if (stateElement) {
          stateElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup("Please Select State",'','error');
      return;
    }
    else if(this.city_name == "" || this.city_name == undefined) {
      setTimeout(() => {
        const cityElement = this.renderer.selectRootElement('#city', true);
        if (cityElement) {
          cityElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup("Please Select City",'','error');
      return;
    }
    else if(!this.registrationForm.value.attendee_purpose || this.registrationForm.value.attendee_purpose.trim() === "") {
      this.SharedService.ToastPopup("Please Select Attending purpose",'','error');
      return;
    }
    else if (!this.registrationForm.get('conference_lever_interest')?.value || this.registrationForm.get('conference_lever_interest')?.value.length === 0) {
      this.SharedService.ToastPopup("Please select at least one interest.",'','error');
      return;
    }

    const returnmobileNumber = this.registrationForm.value.mobile_number;
    const returnDOB = this.registrationForm.value.dob;

    const rawMobileNumber = this.registrationForm.value.mobile_number.number;
    let formattedMobileNumber = rawMobileNumber.replace(/\s+/g, '');
    console.log(formattedMobileNumber);

    this.registrationForm.patchValue({
      country_code: this.registrationForm.value.mobile_number.dialCode,
      mobile_number: formattedMobileNumber,
      dob: this.formattedDate,
      country : this.country_name,
      state : this.state_name,
      city : this.city_name
    });

    this.submitted = true;

    if (this.submitted) {
      this.reqBody = {
        ...this.registrationForm.value,
      };

      this.ngxService.start();
      this.SharedService.registration(this.reqBody).subscribe(
        async (result: any) => {
          if (result.success) {
            console.log('result', result);
            // this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'success');
            this.registrationForm.reset();

            this.delegateId = result.delegate_id;
            const rawNomineeMobileNumber = this.nominee_mobile_number;

            // Extract the actual number (adjust based on actual object structure)
            let formattedNomineeMobileNumber = '';

            if (rawNomineeMobileNumber && typeof rawNomineeMobileNumber === 'object') {
              formattedNomineeMobileNumber = rawNomineeMobileNumber.number
                ? rawNomineeMobileNumber.number.replace(/\s+/g, '') // Remove spaces
                : '';
            } else if (typeof rawNomineeMobileNumber === 'string') {
              formattedNomineeMobileNumber = rawNomineeMobileNumber.replace(/\s+/g, '');
            }

            console.log("Formatted Nominee Mobile Number:", formattedNomineeMobileNumber);


            setTimeout(() => {
              console.log('get payment URL', result.url);
              console.log("settimeout");

              if(this.delegateId){
                let body = {
                  "delegate_id": this.delegateId,
                  "nomination_name": this.nomineeName,
                  "relation_id": this.nomineeRelation,
                  "dob": this.nomineeFormattedDate,
                  "email": this.nomineeEmail,
                  "mobile_no": formattedNomineeMobileNumber,
                  "institution": this.instituteName
                }
                this.delegateService.getNominationProfileApi(body).subscribe({
                  next : (res:any)=>{
                    console.log("Res",res);
                    if(res.success) {
                      this.ngxService.stop();
                      if (result.url) {
                        window.location.href = result.url; // Redirect to Stripe Checkout
                      }
                    }
                  }
                })
              }
              this.ngxService.stop();
              // if (result.url) {
              //   window.location.href = result.url; // Redirect to Stripe Checkout
              // }
            }, 5000);
          } else {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'error');
          }
        },
        (err) => {
          this.ngxService.stop();
          this.registrationForm.patchValue({
            mobile_number: returnmobileNumber,
            dob: returnDOB,
          });

          this.SharedService.ToastPopup('', err.error.message, 'error');
        }
      );
    }
  }

  openPopup() {
    this.showPopup = true;
    this.display = 'block';
    this.formdisplay = false;
  }

  closeModal() {
    this.display = 'none';
    this.showPopup = false;
    this.formdisplay = true;
    this.registrationForm.reset({});
    this.router.navigateByUrl('/home');
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

  onInput(event: any, controlName: string) {
    let inputValue = event.target.value.replace(/^\s+/, ''); // Remove leading spaces

    let allowedPattern: RegExp;

    switch (controlName) {
      case 'first_name':
        allowedPattern =  /^[a-zA-Z\s'-]+$/; // Allows only alphabets, spaces, and hyphens
        break;
      case 'last_name':
        allowedPattern = /^[a-zA-Z\s-]+$/; // Allows only alphabets, spaces, and hyphens
        break;
      case 'email_id':
        allowedPattern = /^[a-zA-Z0-9@._-]+$/; // Allowed characters for email
        inputValue = inputValue.toLowerCase(); // Convert email to lowercase
        break;
      case 'website':
        allowedPattern = /^[a-zA-Z0-9.:/_-]+$/; // Allowed characters for website
        break;
      case 'linkedin':
        allowedPattern = /^[a-zA-Z0-9.:/_%+-]+$/; // Allows LinkedIn profile URLs
        break;
      case 'title':
        allowedPattern = /^[a-zA-Z]+$/; // **Alphabets only (A-Z, a-z), no spaces**
        break;
      case 'organization_name':
        allowedPattern = /^[a-zA-Z. ]+$/; // Allows alphabets, a single space, and a period (.)
        break;
      default:
        allowedPattern = /.*/; // No restriction for other fields
    }

    // Remove invalid characters dynamically
    inputValue = inputValue.split('').filter((char:any) => allowedPattern.test(char)).join('');

    // Update the form control with the cleaned value
    this.registrationForm.controls[controlName].setValue(inputValue, {
      emitEvent: false,
    });
  }


  handleTabKey(event: KeyboardEvent, nextFieldId: string) {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default tab behavior

      const nextField = document.getElementById(nextFieldId) as HTMLElement;
      if (nextField) {
        nextField.focus(); // Move focus to DOB field

        // Open the datepicker when moving to DOB field
        if (nextFieldId === 'dob') {
          this.openDatepicker();
        }
      }
    }
  }

  openDatepicker() {
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    if (dobInput) {
      dobInput.click(); // Open ngx-bootstrap datepicker
    }
  }

  getIPAddress(){
    this.SharedService.getIPAddress().subscribe({
      next :(res:any)=>{
        this.ipAddress = res.ip;
      }
    })
  }

  getDeviceOS(): string {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/Win/i.test(userAgent)) return 'Windows';
    if (/Mac/i.test(userAgent)) return 'MacOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  startTimer() {
    if (this.interval) {
      clearInterval(this.interval); // Clear any existing timer
    }

    this.timerExpired =false;
    this.countdown = 100; // Reset countdown to 100 seconds
    this.buttonText = "Resend OTP";

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.timerExpired = true;
        this.buttonText = "Resend OTP";
        clearInterval(this.interval); // Stop the timer when it reaches 0
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval); // Clear timer when component is destroyed
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getRelationData(){
    let body = {
       "parent_code":"NOMINATION",
       "type":"ANSWER"
    }
    this.delegateService.getRelationDataApi(body).subscribe({
      next : (res)=>{
        console.log("Res",res);
        this.relationData = res;
      }
    })
  }

  onUserTypeChange(selectedType: string): void {
    this.userType = selectedType;
    console.log('User Type Selected:', this.userType);
    this.registrationForm.get('dob')?.updateValueAndValidity(); // Revalidate on user type change

  }

  validateNomineeName(event: KeyboardEvent) {
    const inputChar = event.key;

    // Allow alphabets and space (except at the beginning)
    if (!/^[A-Za-z ]$/.test(inputChar) && inputChar !== 'Backspace') {
      event.preventDefault();
    }

    // Prevent space at the beginning
    if (event.target instanceof HTMLInputElement && event.target.value.length === 0 && inputChar === ' ') {
      event.preventDefault();
    }
  }


  // if select student => then nominee form NomeneeDOB validation should  be greater than 21 and another Form field DOB should be less than 21

  // if select adult => then nominee form NomeneeDOB should validation be less than 21 and Form field DOB should greather than 21

  // if select student then nominee age should be greter than 21 and another Form field DOB should be less than 21 and minimum 15 not less than 15 ok

  // if selct adult => then nominee age should be less than 21 till 15 less and and Form field DOB should greather than 21


}
