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

@Component({
  selector: 'app-delegate-registration',
  templateUrl: './delegate-registration.component.html',
  styleUrls: ['./delegate-registration.component.css'],
})
export class DelegateRegistrationComponent {
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


  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  onCountryChange(event: any): void {
    this.selectedCountryISO = event.iso2; // Update the selected country ISO
  }

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private DelegateService: DelegateService,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer : Renderer2
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
      dob: ['', [Validators.required, this.ageValidator]],
      country_code: [''],
      mobile_number: ['', [Validators.minLength(7), Validators.required]],
      email_id: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      linkedIn_profile: [''],
      instagram_profile: [''],
      profession_1: ['', [Validators.required]],
      profession_2: [''],
      website: ['', [Validators.pattern('^[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$')]],
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

  ageValidator(control: FormControl) {
    const selectedDate = new Date(control.value);

    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // If selected date is after or on the date 18 years ago, it's invalid
    if (selectedDate > eighteenYearsAgo) {
      return { ageError: 'Date must be at least 18 years ago' };
    }

    return null; // Valid date
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
    this.DelegateService.getAllCountrycode().subscribe(
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

  getAllCountries() {
    this.DelegateService.getAllCountries().subscribe(
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
      this.DelegateService.getAllStates(countryObj.id).subscribe(
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
    this.DelegateService.getAllCities(stateObj.id).subscribe((res: any) => {
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
      this.SharedService.ToastPopup('Only letters, spaces, _, -, @, and & are allowed.','','error');
    }
  }

  onProfessionInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const allowedPattern = /^[a-zA-Z\s_@&-]*$/; // Allowed characters

    if (!allowedPattern.test(input.value)) {
      input.value = input.value.replace(/[^a-zA-Z\s_@&-]/g, ''); // Remove invalid characters
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }


  validateAlpha(event: any) {
    const allowedPattern = /^[a-zA-Z\s\-_‘]$/;

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
      // Check if the pressed key is the space bar and the input is empty
      if (event.key === ' ' && event.code === 'Space') {
        event.preventDefault(); // Prevent the space character from being typed
      } else if (event.code === 'Backspace') {
        if (inputValue.number.length < 7) {
          this.mobile_numberVal = true;
          // event.preventDefault()
        } else {
          this.mobile_numberVal = false;
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && event.code === 'Space') {
      event.preventDefault(); // Prevent the space character from being typed
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

    if(this.registrationForm.value.title == "" || this.registrationForm.value.title == undefined){
      this.renderer.selectRootElement('#title').focus();
      this.SharedService.ToastPopup("Please Enter Title",'','error');
      return;
    }
    else if(this.registrationForm.value.first_name == "" || this.registrationForm.value.first_name == undefined) {
      this.renderer.selectRootElement('#f_name').focus();
      this.SharedService.ToastPopup("Please Enter First Name",'','error');
      return;
    }
    else if(this.registrationForm.value.last_name == "" || this.registrationForm.value.last_name == undefined) {
      this.renderer.selectRootElement('#l_name').focus();
      this.SharedService.ToastPopup("Please Enter Last Name",'','error');
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
    else if(this.registrationForm.value.profession_1 == "" || this.registrationForm.value.profession_1 == undefined) {
      this.renderer.selectRootElement('#profession1').focus();
      this.SharedService.ToastPopup("Please Enter Profeesion",'','error');
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
    else if(this.registrationForm.value.attendee_purpose == "" || this.registrationForm.value.attendee_purpose == undefined) {
      this.SharedService.ToastPopup("Please Select Attending purpose",'','error');
      return;
    }
    else if(this.registrationForm.get('conference_lever_interest')?.value.length == 0) {
      this.SharedService.ToastPopup("Please select at least one interest.",'','error');
      return;
    }

    const returnmobileNumber = this.registrationForm.value.mobile_number;
    const returnDOB = this.registrationForm.value.dob;
    console.log(returnmobileNumber, 'mobileNumber');

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

            setTimeout(() => {
              console.log('get payment URL', result.url);
              this.ngxService.stop();
              if (result.url) {
                window.location.href = result.url; // Redirect to Stripe Checkout
              }
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
    const trimmedValue = event.target.value.replace(/^\s+/, ''); // Remove leading spaces
    this.registrationForm.controls[controlName].setValue(trimmedValue, {
      emitEvent: false,
    });
  }
}
