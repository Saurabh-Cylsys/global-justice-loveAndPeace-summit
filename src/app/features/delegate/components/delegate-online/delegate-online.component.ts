import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

interface RegistrationData {
  // name: string;
  // email: string;
  // mobile_no: string;


  first_name : string,
  last_name : string,
  email_id: string,
  mobile_number:  string,
  country_id:string;
  title ?: string,
  reference_no? : any,
  dob ?: string,
  is_nomination?: string,
  p_type?: string,
  p_reference_by?: string
}

interface CompleteProfileData {
  title: string;
  dob: string;
  profession: string;
  organization_name: string;
  address: string;
  country: string;
  city: string;
}

@Component({
  selector: 'app-delegate-online',
  templateUrl: './delegate-online.component.html',
  styleUrls: ['./delegate-online.component.css']
})
export class DelegateOnlineComponent implements OnInit {
  userForm!: FormGroup;
  completeProfileForm!: FormGroup;
  showPaymentSuccess = false;
  showCompleteProfileForm = false;
  paymentSuccess = false;
  paymentLink: SafeResourceUrl | null = null;
  loading = false;
  registrationData: RegistrationData | null = null;
  sessionId: any;
  isPaymentStatus: any;
  transactionVerified: boolean = false;
  countryData: any = [];
  showCountryDropdown = false;
  filteredCountries: any[] = [];
  selectedCountryName = '';
  referralCode: any = "";
  formattedDateOfBirth: string = '';
  minDate: any;
  maxDate: any;
  colorTheme: string = "theme-dark-blue";
  mobile_numberVal: boolean = false;

  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  selectedCountryISO: any;
  SearchCountryField = SearchCountryField;

  constructor(
    private fb: FormBuilder,
    private delegateService: DelegateService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private encryptionService: EncryptionService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params != undefined && Object.keys(params).length > 0) {
        this.referralCode = params.code;

        // this.router.navigate([], {
        //   relativeTo: this.route,
        //   queryParams: { '': 'rakesh.gupta.pc' }, // Customize the URL
        //   replaceUrl: true // Replace the current URL in the browser history
        // });
      }
    });

    const today = new Date();
    // Max date is 18 years ago from today
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // Min date is 120 years ago from today
    this.minDate = new Date(today.getFullYear() - 120, 0, 1);
  }

  async ngOnInit() {

    this.initializeForms();
    this.checkQueryParams();
    this.setupFormSubscriptions();

    await this.getAllCountries();
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

  get f() {
    return this.userForm.controls;
  }

  getcontrol(name: any): AbstractControl | null {
    return this.userForm.get(name);
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

  disableManualInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  private initializeForms() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email:  ['',
        [Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]
      ],
      // countryCode: ['-1', Validators.required],
      mobile_number: ['', [Validators.required, Validators.minLength(7)]],
      country: ['', Validators.required],
      dob: ['', [Validators.required]],
      reference_no: [this.referralCode ? this.referralCode : ''],
    });
  }

  keyPressNumbers(event: KeyboardEvent) {
    const inputValue = this.userForm.controls['mobile_number'].value; // Get value from form control
    if (inputValue && inputValue.number) {
      if (inputValue.number.length < 7) {
        this.mobile_numberVal = true;
      } else {
        this.mobile_numberVal = false;
      }
    }
  }


  // getPhoneErrorMessage() {
  //   const control = this.userForm.controls['mobile_number'];
  //   if (control.value) {
  //     if (control?.errors?.validatePhoneNumber['valid']) {
  //       return '';
  //     } else {
  //       return 'Invalid mobile number for selected country.';
  //     }
  //   }
  //   return '';
  // }

  getPhoneErrorMessage() {
    const control = this.userForm.controls['mobile_number'];
    if (control.value && control.errors) {
      const phoneError = control.errors['validatePhoneNumber']; // Use bracket notation
      if (phoneError?.valid) {
        return '';
      } else {
        return 'Invalid mobile number for selected country.';
      }
    }
    return '';
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

  private checkQueryParams() {
    debugger;
    this.route.queryParams.subscribe(params => {

      console.log('params...', params);
      if (params['session_id']) {
        this.sessionId = params['session_id'] || 'No session_id';
        this.registrationData = {
          first_name: params['first_name'] || '',
          last_name: params['last_name'] || '',
          email_id: params['email_id'],
          mobile_number: params['mobile_no'],
          country_id: params['country_id']
        };
        this.handlePaymentSuccess();
      }
    });
  }
  private setupFormSubscriptions() {
    this.userForm.get('email')?.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
    this.userForm.get('mobile')?.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }

  async verifySession() {
    let body = {
      sessionId: this.sessionId
    }
    console.log('body', body);
    await this.delegateService.postVerifySessionOnline(body).subscribe({
      next: (response: any) => {
        if (response.success) {
          //console.log('Session Verified:', response.session);
          this.isPaymentStatus = true;
          this.transactionVerified = true;
          this.showPaymentSuccess = true;
          if (this.registrationData && this.paymentSuccess) {
            this.userForm.patchValue({
              first_name: this.registrationData.first_name,
              last_name: this.registrationData.last_name,
              email_id: this.registrationData.email_id,
              mobile_number: this.registrationData.mobile_number,
              reference_no:this.referralCode
            });
          }
        } else {
          this.isPaymentStatus = 'failed';
        }
      },
      error: (err) => console.error('Error verifying session:', err),
    });
  }

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDateOfBirth =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    console.log("Userform",this.userForm.value);

    const returnmobileNumber = this.userForm.value.mobile_number;
    console.log(returnmobileNumber, 'mobileNumber');
    const country_code = this.userForm.value.mobile_number.dialCode;
    const rawMobileNumber = this.userForm.value.mobile_number.number;
    let formattedMobileNumber = rawMobileNumber.replace(/[^0-9]/g, ''); // Keeps only numbers;
    console.log(formattedMobileNumber);

    // Get the full name entered by the user
      const fullName = this.userForm.get('name')?.value.trim();

      // Split the full name into parts
      const nameParts = fullName.split(' ');

      // Extract first and last name
      const firstName = nameParts[0] || ''; // First part as first name
      const lastName = nameParts.slice(1).join(' ') || ''; // Remaining as last name

    if (this.userForm.valid) {
      this.loading = true;
      const payload = {
        title: "Mr",
        first_name : firstName,
        last_name : lastName,
        name: this.userForm.get('name')?.value,
        email_id: this.userForm.get('email')?.value.toLowerCase(),
        // mobile_number: country_code + formattedMobileNumber,
        mobile_number: formattedMobileNumber,
        country_id: JSON.parse(this.userForm.value.country).id,
        // country_id: this.userForm.value.country.id,

        reference_no: this.referralCode,
        dob: this.formattedDateOfBirth,
        is_nomination:"0",
        p_type:"DELEGATE_ONLINE",
        p_reference_by:"0"
      };

      this.delegateService.postDelegateOnline(payload).subscribe({
        next: (response: any) => {

          this.sharedService.ToastPopup('Success', response.message, 'success');
          this.registrationData = payload;
          setTimeout(() => {
            if (response.url) {
              localStorage.setItem('delegateRegistration', JSON.stringify(payload));
              window.location.href = response.url;
            }
          }, 5000);

          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error creating delegate:', error);
          this.sharedService.ToastPopup('Error', error.error?.message || 'Registration failed', 'error');
          this.loading = false;
        }
      });
    }
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
    this.userForm.controls[controlName].setValue(inputValue, {
      emitEvent: false,
    });
  }

  checkFormValidity() {
    if (this.userForm.valid) {
      //this.createDelegateOnline();
    }
  }
  async handlePaymentSuccess() {

    await this.verifySession();

  }

  showCompleteProfile() {
    const params = {
      email_id: this.registrationData?.email_id || '',
      mobile_number: this.registrationData?.mobile_number || '',
      first_name: this.registrationData?.first_name || '',
      last_name: this.registrationData?.last_name || '',
      country_id:this.registrationData?.country_id || '',
      isOnline: true
    };
    sessionStorage.setItem('IsOnline', 'true');
    const encryptedParams = this.encryptionService.encryptData(params);
    this.router.navigate(['/delegate-registration-online'], {
      queryParams: { data: encryptedParams }
    });
    // this.router.navigate(['/delegate-registration'], {
    //   queryParams: {
    //     email: this.encrypt(this.registrationData?.email || ''),
    //     mobile_no: this.encrypt(this.registrationData?.mobile_no || ''),
    //     name: this.encrypt(this.registrationData?.name || ''),
    //     isOnline: true
    //   }
    // });
  }
  onCompleteProfile() {
    if (this.completeProfileForm.valid) {
      const profileData: CompleteProfileData = this.completeProfileForm.value;
      // this.delegateService.updateDelegateProfile(profileData).subscribe({
      //   next: (response: any) => {
      //     this.sharedService.ToastPopup('Success', 'Profile updated successfully', 'success');
      //     // Additional logic after profile completion
      //   },
      //   error: (error: any) => {
      //     this.sharedService.ToastPopup('Error', error.error?.message || 'Profile update failed', 'error');
      //   }
      // });
    }
  }
  filterCountries(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.showCountryDropdown = true;
    this.filteredCountries = this.countryData.filter((country: any) =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }
  selectCountry(country: any) {
    this.selectedCountryName = country.name;
    this.userForm.patchValue({
      country: JSON.stringify(country),
      countrySearch: country.name
    });
    this.showCountryDropdown = false;
    this.changeCountry({ target: { value: JSON.stringify(country) } });
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!event.target.closest('.position-relative')) {
      this.showCountryDropdown = false;
    }
  }
  changeCountry(e: any) {
    const selectedValue = e.target.value;
    const countryObj = JSON.parse(selectedValue); // Convert JSON string back to object
    this.userForm.patchValue({ country_id: countryObj.id });
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
}
