
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/environments/environment';
import { param } from 'jquery';
import { EncryptionService } from 'src/app/shared/services/encryption.service';

@Component({
  selector: 'app-delegate-registration-online',
  templateUrl: './delegate-registration-online.component.html',
  styleUrls: ['./delegate-registration-online.component.css']
})
export class DelegateRegistrationOnlineComponent {
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
  @ViewChild('number_mobile1', { static: false })
  mobileNumberInput!: ElementRef;
  @ViewChild('dobPicker') dobPicker!: BsDatepickerDirective;
  ipAddress: string = '';
  deviceInfo: any = '';
  isOTPReceive: boolean = false;
  txtVerifyOTP: string = '';
  countdown: number = 100; // 5 minutes in seconds
  timerExpired: boolean = false;
  interval: any;
  buttonText: string = 'Send OTP';
  mediumValue: string | null = '';
  email: string = '';
  mobileNo: string = '';
  name: string = '';
  title : string = '';
  tinyURL: string = environment.tinyUrl;
  isOnline: boolean = false;
  country_id: any;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private delegateService: DelegateService,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private encryptionService: EncryptionService,
    private cdr: ChangeDetectorRef
  ) {
    this.fullURL = window.location.href;

    const today = new Date();

    // Max date is 18 years ago from today
    this.maxDate1 = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // Min date is 120 years ago from today
    this.minDate1 = new Date(today.getFullYear() - 120, 0, 1);
  }

async ngOnInit() {
    this.checkWindowSize();
    // this.dobValidator();

    this.route.queryParams.subscribe((params: any) => {
      if (params != undefined && Object.keys(params).length > 0) {
        this.referralCode = params.code;

        if (params['data']) {
          const decryptedData = this.encryptionService.decryptData(params['data']);

          if (decryptedData) {
            this.title = decryptedData.title;
            this.email = decryptedData.email;
            this.mobileNo = decryptedData.mobile_no;
            this.name = decryptedData.name;
            this.isOnline = decryptedData.isOnline;
            this.country_id = decryptedData.country_id
          }
        }
      }
    });
    this.createForm();    // this.getdates()
    await this.getAllCountries();

    console.log("this.countryData", this.countryData);

   if (this.isOnline && this.countryData.length > 0) {
       this.setCountry();
    }
  }

  setCountry() {
    const selectedCountry = this.countryData.find((country: any) => country.id == this.country_id);

    if (selectedCountry) {
      this.registrationForm.patchValue({
        country: selectedCountry.name,
        country_id: +selectedCountry.id
      });

      this.cdr.detectChanges(); // 👈 Force UI update

      // this.registrationForm.patchValue({ country: selectedCountry });

    } else {
      console.warn("Country not found for ID:", this.country_id);
    }

    console.log("Selected Country:", this.registrationForm.value.country);
    console.log("Selected CountryID:", this.registrationForm.value.country_id);
  }

  // Function to extract mobile number without country code
  async extractMobileNumber(rawMobileNumber: any) {
    // Remove all non-numeric characters
    let cleanedNumber = rawMobileNumber.replace(/[^0-9]/g, '');

    await this.getAllCountrycode();
    // Possible country code lengths (1 to 3 digits)
    for (let countryCodeLength = 1; countryCodeLength <= 3; countryCodeLength++) {
      // Extract the potential mobile number
      let mobileNumber = cleanedNumber.slice(countryCodeLength);

      // Check if the remaining number length is reasonable (7 to 12 digits)
      if (mobileNumber.length >= 7 && mobileNumber.length <= 12) {
        return mobileNumber;
      }
    }

    // If no valid country code length is found, return the cleaned number (or handle as needed)
    return cleanedNumber;
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  onCountryChange(event: any): void {
    this.selectedCountryISO = event.iso2; // Update the selected country ISO
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

  createForm() {

    this.registrationForm = this.formBuilder.group({
      title: [this.title, [Validators.required]],
      first_name: [this.name ? this.name.split(' ')[0] : '', [Validators.required]],
      last_name: [this.name ? this.name.split(' ')[1] : '', [Validators.required]],
      dob: ['', [Validators.required]],
      country_code: [''],
      mobile_number: [this.mobileNo || '', [Validators.minLength(7), Validators.required]],
      email_id: [
        this.email || '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      linkedIn_profile: [''],
      instagram_profile: [''],
      profession_1: ['', [Validators.required]],
      profession_2: [''],
      website: [
        '',
        [
          Validators.pattern(
            '^(https?:\\/\\/)?([\\w.-]+)\\.([a-z]{2,6})([\\/\\w .-]*)*\\/?$'
          ),
        ],
      ],
      organization_name: [''],
      address: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
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

  async getAllCountrycode() {
    await this.delegateService.getAllCountrycode().subscribe(
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

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDate =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

 async getAllCountries() {
  try {
    const response = await this.delegateService.getAllCountryApi();
    this.countryData = response.data;
    console.log("Country Data:", this.countryData);

    // Ensure we bind the country only after fetching data
    if (this.isOnline) {
      this.setCountry();
    }

  } catch (error) {
    console.error("Error fetching countries:", error);
  }
  }

  changeCountry(e: any) {
    debugger;
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
    } else {
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
    this.registrationForm.controls['profession_1'].setValue(inputValue, {
      emitEvent: false,
    });
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
    this.registrationForm.controls['profession_2'].setValue(inputValue, {
      emitEvent: false,
    });
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
      this.SharedService.ToastPopup(
        'Only letters, numbers, spaces, and @, . - _ ( ) are allowed.',
        '',
        'error'
      );
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
      if (
        event.key === ' ' &&
        event.code === 'Space' &&
        inputValue.number.length === 0
      ) {
        event.preventDefault();
        return;
      }

      // Allow only numbers, Backspace, Delete, Arrow Keys, and Tab
      if (
        !/^[0-9]$/.test(event.key) &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
          event.key
        )
      ) {
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

  onKeyDown(
    event: KeyboardEvent,
    fieldType: 'email' | 'website' | 'linkedin'
  ): void {
    if (
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
        event.key
      )
    ) {
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

  onInputEvent(
    event: KeyboardEvent | ClipboardEvent,
    fieldType: 'email' | 'website' | 'linkedin'
  ): void {
    if (event.type === 'paste') {
      // Handle paste event
      event.preventDefault();
      const clipboardData =
        (event as ClipboardEvent).clipboardData?.getData('text') || '';

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
    if (
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
        keyEvent.key
      )
    ) {
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
    if (
      !this.registrationForm.value.title ||
      this.registrationForm.value.title.length < 2
    ) {
      this.renderer.selectRootElement('#title').focus();
      this.SharedService.ToastPopup(
        'Title must be at least 2 characters long.',
        '',
        'error'
      );
      return;
    } else if (
      !this.registrationForm.value.first_name ||
      this.registrationForm.value.first_name.length < 3
    ) {
      this.renderer.selectRootElement('#f_name').focus();
      this.SharedService.ToastPopup(
        'First Name must be at least 3 characters long.',
        '',
        'error'
      );
      return;
    } else if (
      !this.registrationForm.value.last_name ||
      this.registrationForm.value.last_name.length < 2
    ) {
      this.renderer.selectRootElement('#l_name').focus();
      this.SharedService.ToastPopup(
        'Last Name must be at least 3 characters long.',
        '',
        'error'
      );
      return;
    } else if (
      this.registrationForm.value.dob == '' ||
      this.registrationForm.value.dob == undefined
    ) {
      this.renderer.selectRootElement('#dob').focus();
      this.SharedService.ToastPopup('Please Select Date Of Birth', '', 'error');
      return;
    }
    else if (
      !this.isOnline &&
      (this.registrationForm.value.mobile_number == '' ||
        this.registrationForm.value.mobile_number == undefined ||
        this.registrationForm.value.mobile_number == null)
    ) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          '#number_mobile1 input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error('Could not find mobile number input field');
        }
      }, 100);

      this.SharedService.ToastPopup('Please Enter  Mobile Number', '', 'error');
      return;
    } else if (
      this.registrationForm.controls['mobile_number'].errors &&
      !this.registrationForm.controls['mobile_number'].errors
        ?.validatePhoneNumber?.valid
    ) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          '#number_mobile1 input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error('Could not find mobile number input field');
        }
      }, 100);

      this.SharedService.ToastPopup(
        'Please enter a valid mobile number for the selected country',
        '',
        'error'
      );
      return;
    }
    else if (
      this.registrationForm.value.email_id == '' ||
      this.registrationForm.value.email_id == undefined
    ) {
      this.renderer.selectRootElement('#email').focus();
      this.SharedService.ToastPopup('Please Enter Email ID', '', 'error');
      return;
    } else if (this.registrationForm.controls['email_id'].invalid) {
      this.renderer.selectRootElement('#email').focus();
      this.SharedService.ToastPopup(
        'Please enter a valid Email ID',
        '',
        'error'
      );
      return;
    } else if (
      !this.registrationForm.value.profession_1 ||
      this.registrationForm.value.profession_1.trim().length < 2
    ) {
      this.renderer.selectRootElement('#profession1').focus();
      this.SharedService.ToastPopup(
        'Profession must be at least 2 characters long.',
        '',
        'error'
      );
      return;
    } else if (this.country_name == '' || this.country_name == undefined) {
      setTimeout(() => {
        const countryElement = this.renderer.selectRootElement(
          '#country',
          true
        );
        if (countryElement) {
          countryElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup('Please Select Country', '', 'error');
      return;
    } else if (this.state_name == '' || this.state_name == undefined) {
      setTimeout(() => {
        const stateElement = this.renderer.selectRootElement('#state', true);
        if (stateElement) {
          stateElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup('Please Select State', '', 'error');
      return;
    } else if (this.city_name == '' || this.city_name == undefined) {
      setTimeout(() => {
        const cityElement = this.renderer.selectRootElement('#city', true);
        if (cityElement) {
          cityElement.focus();
        }
      }, 100);
      this.SharedService.ToastPopup('Please Select City', '', 'error');
      return;
    } else if (
      !this.registrationForm.value.attendee_purpose ||
      this.registrationForm.value.attendee_purpose.trim() === ''
    ) {
      this.SharedService.ToastPopup(
        'Please Select Attending purpose',
        '',
        'error'
      );
      return;
    } else if (
      !this.registrationForm.get('conference_lever_interest')?.value ||
      this.registrationForm.get('conference_lever_interest')?.value.length === 0
    ) {
      this.SharedService.ToastPopup(
        'Please select at least one interest.',
        '',
        'error'
      );
      return;
    }

    // const returnmobileNumber = this.registrationForm.value.mobile_number;
    const returnDOB = this.registrationForm.value.dob;


    // let formattedMobileNumber = returnmobileNumber.replace(/[^0-9]/g, ''); // Keeps only numbers;
    // console.log(formattedMobileNumber);
    const result = this.extractPhoneComponents(this.mobileNo);
    let formattedMobileNumber = result.mobileNumber;
    let countryCode = result.countryCode

    this.registrationForm.patchValue({
      country_code: countryCode,
      mobile_number: formattedMobileNumber,
      dob: this.formattedDate,
      country: this.country_name,
      state: this.state_name,
      city: this.city_name,
    });

    this.submitted = true;

    if (this.submitted) {

      this.reqBody = {
        ...this.registrationForm.value,
        is_nomination: "0",
        p_type: "DELEGATE_ONLINE",
        p_reference_by: '0'
      };


      this.ngxService.start();
      this.SharedService.registrationOnline(this.reqBody).subscribe(
        async (result: any) => {
          if (result.success) {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'success');
            this.registrationForm.reset();
            setTimeout(() => {
                this.router.navigateByUrl('/delegate-message');
            }, 3000);

          } else {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'error');
          }
        },
        (err) => {
          this.ngxService.stop();
          this.registrationForm.patchValue({
            mobile_number: formattedMobileNumber,
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

  extractPhoneComponents(phoneNumber: string): {
    countryCode: string;
    mobileNumber: string;
  } {
    // Remove any non-digit characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    // Use a mapping of country codes to determine the correct split
    // Country codes can be 1-3 digits in length
    const countryCodes: {[key: string]: string} = {
      '1': 'United States/Canada',
      '7': 'Russia/Kazakhstan',
      '20': 'Egypt',
      '27': 'South Africa',
      '30': 'Greece',
      '31': 'Netherlands',
      '32': 'Belgium',
      '33': 'France',
      '34': 'Spain',
      '36': 'Hungary',
      '39': 'Italy',
      '40': 'Romania',
      '41': 'Switzerland',
      '43': 'Austria',
      '44': 'United Kingdom',
      '45': 'Denmark',
      '46': 'Sweden',
      '47': 'Norway',
      '48': 'Poland',
      '49': 'Germany',
      '51': 'Peru',
      '52': 'Mexico',
      '53': 'Cuba',
      '54': 'Argentina',
      '55': 'Brazil',
      '56': 'Chile',
      '57': 'Colombia',
      '58': 'Venezuela',
      '60': 'Malaysia',
      '61': 'Australia',
      '62': 'Indonesia',
      '63': 'Philippines',
      '64': 'New Zealand',
      '65': 'Singapore',
      '66': 'Thailand',
      '81': 'Japan',
      '82': 'South Korea',
      '84': 'Vietnam',
      '86': 'China',
      '90': 'Turkey',
      '91': 'India',
      '92': 'Pakistan',
      '93': 'Afghanistan',
      '94': 'Sri Lanka',
      '95': 'Myanmar',
      '98': 'Iran',
      '212': 'Morocco',
      '213': 'Algeria',
      '216': 'Tunisia',
      '218': 'Libya',
      '220': 'Gambia',
      '221': 'Senegal',
      '222': 'Mauritania',
      '223': 'Mali',
      '224': 'Guinea',
      '225': 'Ivory Coast',
      '226': 'Burkina Faso',
      '227': 'Niger',
      '228': 'Togo',
      '229': 'Benin',
      '230': 'Mauritius',
      '231': 'Liberia',
      '232': 'Sierra Leone',
      '233': 'Ghana',
      '234': 'Nigeria',
      '235': 'Chad',
      '236': 'Central African Republic',
      '237': 'Cameroon',
      '238': 'Cape Verde',
      '239': 'São Tomé and Príncipe',
      '240': 'Equatorial Guinea',
      '241': 'Gabon',
      '242': 'Republic of the Congo',
      '243': 'Democratic Republic of the Congo',
      '244': 'Angola',
      '245': 'Guinea-Bissau',
      '246': 'British Indian Ocean Territory',
      '248': 'Seychelles',
      '249': 'Sudan',
      '250': 'Rwanda',
      '251': 'Ethiopia',
      '252': 'Somalia',
      '253': 'Djibouti',
      '254': 'Kenya',
      '255': 'Tanzania',
      '256': 'Uganda',
      '257': 'Burundi',
      '258': 'Mozambique',
      '260': 'Zambia',
      '261': 'Madagascar',
      '262': 'Réunion',
      '263': 'Zimbabwe',
      '264': 'Namibia',
      '265': 'Malawi',
      '266': 'Lesotho',
      '267': 'Botswana',
      '268': 'Eswatini',
      '269': 'Comoros',
      '297': 'Aruba',
      '298': 'Faroe Islands',
      '299': 'Greenland',
      '350': 'Gibraltar',
      '351': 'Portugal',
      '352': 'Luxembourg',
      '353': 'Ireland',
      '354': 'Iceland',
      '355': 'Albania',
      '356': 'Malta',
      '357': 'Cyprus',
      '358': 'Finland',
      '359': 'Bulgaria',
      '370': 'Lithuania',
      '371': 'Latvia',
      '372': 'Estonia',
      '373': 'Moldova',
      '374': 'Armenia',
      '375': 'Belarus',
      '376': 'Andorra',
      '377': 'Monaco',
      '378': 'San Marino',
      '379': 'Vatican City',
      '380': 'Ukraine',
      '381': 'Serbia',
      '382': 'Montenegro',
      '383': 'Kosovo',
      '385': 'Croatia',
      '386': 'Slovenia',
      '387': 'Bosnia and Herzegovina',
      '389': 'North Macedonia',
      '420': 'Czech Republic',
      '421': 'Slovakia',
      '423': 'Liechtenstein',
      '500': 'Falkland Islands',
      '501': 'Belize',
      '502': 'Guatemala',
      '503': 'El Salvador',
      '504': 'Honduras',
      '505': 'Nicaragua',
      '506': 'Costa Rica',
      '507': 'Panama',
      '509': 'Haiti',
      '590': 'Guadeloupe',
      '591': 'Bolivia',
      '592': 'Guyana',
      '593': 'Ecuador',
      '595': 'Paraguay',
      '597': 'Suriname',
      '598': 'Uruguay',
      '599': 'Curaçao',
      '670': 'East Timor',
      '672': 'Norfolk Island',
      '673': 'Brunei',
      '674': 'Nauru',
      '675': 'Papua New Guinea',
      '676': 'Tonga',
      '677': 'Solomon Islands',
      '678': 'Vanuatu',
      '679': 'Fiji',
      '680': 'Palau',
      '681': 'Wallis and Futuna',
      '682': 'Cook Islands',
      '683': 'Niue',
      '685': 'Samoa',
      '686': 'Kiribati',
      '687': 'New Caledonia',
      '688': 'Tuvalu',
      '689': 'French Polynesia',
      '690': 'Tokelau',
      '691': 'Micronesia',
      '692': 'Marshall Islands',
      '850': 'North Korea',
      '852': 'Hong Kong',
      '853': 'Macau',
      '855': 'Cambodia',
      '856': 'Laos',
      '880': 'Bangladesh',
      '886': 'Taiwan',
      '960': 'Maldives',
      '961': 'Lebanon',
      '962': 'Jordan',
      '963': 'Syria',
      '964': 'Iraq',
      '965': 'Kuwait',
      '966': 'Saudi Arabia',
      '967': 'Yemen',
      '968': 'Oman',
      '970': 'Palestine',
      '971': 'United Arab Emirates',
      '972': 'Israel',
      '973': 'Bahrain',
      '974': 'Qatar',
      '975': 'Bhutan',
      '976': 'Mongolia',
      '977': 'Nepal',
      '992': 'Tajikistan',
      '993': 'Turkmenistan',
      '994': 'Azerbaijan',
      '995': 'Georgia',
      '996': 'Kyrgyzstan',
      '998': 'Uzbekistan'
    };

    // Try to find the country code
    let countryCode = '';
    let mobileNumber = cleanedNumber;

    // Try 3-digit codes first, then 2-digit, then 1-digit
    for (let i = 3; i >= 1; i--) {
      if (cleanedNumber.length > i) {
        const potentialCode = cleanedNumber.substring(0, i);
        if (countryCodes[potentialCode]) {
          countryCode = potentialCode;
          mobileNumber = cleanedNumber.substring(i);
          break;
        }
      }
    }

    // If no country code is found, use a default approach
    if (!countryCode) {
      // Assume first 1-3 digits might be country code
      countryCode = cleanedNumber.substring(0, Math.min(3, cleanedNumber.length - 6));
      mobileNumber = cleanedNumber.substring(countryCode.length);
    }

    return {
      countryCode,
      mobileNumber
    };
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
        allowedPattern = /^[a-zA-Z\s'-]+$/; // Allows only alphabets, spaces, and hyphens
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
    inputValue = inputValue
      .split('')
      .filter((char: any) => allowedPattern.test(char))
      .join('');

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
}

