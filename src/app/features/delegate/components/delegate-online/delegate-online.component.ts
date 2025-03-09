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
  delagateType: any;
  pType: string = "";

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
        debugger;
        this.referralCode = params.code;

        this.delagateType = params.dType;

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
      title: ['', [Validators.required,Validators.minLength(2)]],
      name: ['', [Validators.required,Validators.minLength(3)]],
      email:  ['',
        [Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]
      ],
      // countryCode: ['-1', Validators.required],
      mobile_number: ['', [Validators.required, Validators.minLength(7)]],
      country: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      reference_no: [this.referralCode ? this.referralCode : ''],
    });
  }

  validateInput(event: any) {
    const inputType = event.target.id; // Get input field id
    let allowedPattern: RegExp;

    switch (inputType) {
      case 'name': // First name should allow only lowercase, uppercase, and underscore (_)
        allowedPattern = /^[a-zA-Z_]$/;
        break;

      case 'email': // Email should allow letters, numbers, dot (.), and @
        allowedPattern = /^[a-zA-Z0-9.@]$/;
        break;

      case 'mobile': // Mobile number should allow only numbers (0-9)
        allowedPattern = /^[0-9]$/;
        break;

      default:
        return; // Exit if no matching case
    }

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }


  keyPressNumbers(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Get the input field
    const inputId = inputElement.id;

    // Allow only numbers (0-9)
    if (inputId === 'mobile_number') {
      const allowedPattern = /^[0-9]$/;

      if (!allowedPattern.test(event.key)) {
        event.preventDefault(); // Block invalid characters
      }
    }

    // Allow Backspace, Delete, Arrow keys for user convenience
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key)) {
      return; // Allow these keys
    }

    // Prevent non-numeric input
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }

    // Validate mobile number length (min 7 digits)
    const inputValue = this.userForm.controls['mobile_number'].value || ''; // Get value from form control
    this.mobile_numberVal = inputValue.length < 7;
  }


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

  private checkQueryParams() {

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

    if (!this.userForm.valid || this.loading) {
      return; // Prevent submission if the form is invalid or loading
    }

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

      if(this.delagateType == 'offline'){
        this.pType = "DELEGATE_ONLINE";
      }
      else{
        this.pType = "DELEGATE_ONLINE";
      }

      const payload = {
        title: this.userForm.get('title')?.value,
        first_name : firstName,
        last_name : lastName,
        mobile_number: formattedMobileNumber,
        email_id: this.userForm.get('email')?.value.toLowerCase(),
        country_code:  this.userForm.get('mobile_number')?.value.dialCode,
        reference_no: this.referralCode ? this.referralCode : '',
        dob: this.formattedDateOfBirth,
        country_id: this.userForm.value.country,
        is_nomination:"0",
        p_type: this.pType,
        p_reference_by:"0"
      };

      this.delegateService.postDelegateOnline(payload).subscribe({
        next: (response: any) => {

          this.sharedService.ToastPopup('Success', response.message, 'success');
          this.registrationData = payload;

          setTimeout(async () => {
            debugger
            if(response.isStripe)
              await this.fnStripePG(response, payload);
            else
              await this.fnMagnatiPG(response, payload);
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

  private async fnStripePG(response: any, payload: any) {
    if (response.success && response.gatewayUrl) {     
      window.location.href = response.gatewayUrl;
    } else {
      this.sharedService.ToastPopup('Error', response.message || 'Payment failed', 'error');
    }
  }

  private async fnMagnatiPG(response: any, payload: { title: any; first_name: any; last_name: any; mobile_number: any; email_id: any; country_code: any; reference_no: any; dob: string; country_id: any; is_nomination: string; p_type: string; p_reference_by: string; }) {
    if (response.success && response.gatewayUrl) {
      localStorage.setItem('delegateRegistration', JSON.stringify(payload));
      //window.location.href = response.payment_link;
      let obj = {
        "email": this.userForm.get('email')?.value.toLowerCase(),
        "pay_type": "DELEGATE_ONLINE",
      };

      await this.delegateService.postDelegateOnlineMP(obj).subscribe({
        next: (response: any) => {
          //window.location.href = response.paymentUrl
          // Redirect to the IPG gateway
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.gatewayUrl;

          Object.keys(response.formData).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = response.formData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();

        },
        error: (error: any) => {
          console.error('Error creating delegate:', error);
          this.loading = false;
        }
      });
    }
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

}
