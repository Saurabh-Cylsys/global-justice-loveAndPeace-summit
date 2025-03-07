import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { HostListener } from '@angular/core';
import { DatePipe, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface RegistrationData {
  name: string;
  email: string;
  mobile_no: string;
  country_id:string;
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
  referralCode: any;
  formattedDate: string = '';
  minDate: string | null = null;
  maxDate: string | null = null;
  colorTheme: string = "theme-dark-blue";
  minDate1:any;
  maxDate1:any;
  isBackNavigation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private delegateService: DelegateService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private encryptionService: EncryptionService,
    private http:HttpClient
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

    this.locationStrategy.onPopState((event) => {
      if (event.type === 'popstate') {
        this.isBackNavigation = true;
        this.handleBackNavigation();
      }
    });
  }

  private handleBackNavigation() {
    // Save form state before clearing
    if(this.userForm.dirty) {
      sessionStorage.setItem('delegateFormState', JSON.stringify(this.userForm.value));
    }

    // Clear stored data
    localStorage.removeItem('delegateRegistration');

    // Reset form to initial state
    if (this.userForm) {
      this.userForm.reset();
      this.initializeForms();
    }

    // Reset component state
    this.showPaymentSuccess = false;
    this.showCompleteProfileForm = false;
    this.paymentSuccess = false;
    this.paymentLink = null;
    this.loading = false;
    this.registrationData = null;
    this.sessionId = null;
    this.isPaymentStatus = null;
    this.transactionVerified = false;
    this.selectedCountryName = '';
  }

  async ngOnInit() {
    // // Restore form state if exists
    // const savedState = sessionStorage.getItem('delegateFormState');
    // if(savedState) {
    //   this.userForm.patchValue(JSON.parse(savedState));
    //   sessionStorage.removeItem('delegateFormState');
    // }

    await this.fnTestPayment();

    await this.getAllCountries();
    this.initializeForms();
    this.checkQueryParams();
    this.setupFormSubscriptions();

    if (this.isBackNavigation) {
      this.handleBackNavigation();
      this.isBackNavigation = false; // Reset flag
    }
  }

  private async fnTestPayment() {
    try {
      const amount = 100.00;
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid payment amount');
      }
      let obj = {
        "amount": 100.00,
        "currency": "AED"
      }
      //const response = await this.delegateService.postDelegateOnlineMP(obj).toPromise();

      const response = await this.http.post('http://localhost:3000/api/initiate-payment', {
        amount: amount
      }).toPromise();

      if (!response || !response.hasOwnProperty('gatewayUrl') || !response.hasOwnProperty('formData')) {
        throw new Error('Invalid payment gateway response');
      }

      // Create hidden form with validation
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = (response as any).gatewayUrl;

      if (!form.action) {
        throw new Error('Gateway URL is required');
      }

      // Add hidden inputs with validation
      const formData = (response as any).formData;
      const requiredFields = ['hash_algorithm', 'storename', 'txndatetime', 'txntype', 'chargetotal', 'currency'];

      requiredFields.forEach(field => {
        if (!formData[field]) {
          throw new Error(`Required field ${field} is missing`);
        }
      });

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Submit form
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Payment initiation failed:', error);
      this.sharedService.ToastPopup('Error', 'Payment initiation failed. Please try again.', 'error');
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
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
      ],
      countryCode: ['-1', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(7)]],
      country: [null, Validators.required],
      countrySearch: [''],
      // dob: ['', [Validators.required, this.ageValidator]],
      // reference_no: [this.referralCode ? this.referralCode : ''],
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

  private checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['session_id']) {
        this.sessionId = params['session_id'] || 'No session_id';
        this.registrationData = {
          name: params['name'] || '',
          email: params['email'],
          mobile_no: params['mobile_no'],
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
    await this.delegateService.postVerifySessionOnline(body).subscribe({
      next: (response: any) => {
        if (response.success) {
          //console.log('Session Verified:', response.session);
          this.isPaymentStatus = true;
          this.transactionVerified = true;
          this.showPaymentSuccess = true;
          if (this.registrationData && this.paymentSuccess) {
            this.userForm.patchValue({
              name: this.registrationData.name,
              email: this.registrationData.email,
              mobile: this.registrationData.mobile_no,
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
    this.formattedDate =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const payload = {
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        mobile_no: `${String(this.userForm.get('countryCode')?.value).replace(/[^0-9]/g, '')}${String(this.userForm.get('mobile')?.value).replace(/[^0-9]/g, '')}`,
        country_id: JSON.parse(this.userForm.value.country).id,
      };

      this.delegateService.postDelegateOnline(payload).subscribe({
        next: (response: any) => {

          this.sharedService.ToastPopup('Success', response.message, 'success');
          this.registrationData = payload;

          let obj = {
            "amount": 100.00,
            "currency": "AED"
          }
          setTimeout(async () => {
            if (response.payment_link) {
              localStorage.setItem('delegateRegistration', JSON.stringify(payload));
              //window.location.href = response.payment_link;

              await this.delegateService.postDelegateOnlineMP(obj).subscribe({
                next: (response: any) => {
                  //window.location.href = response.paymentUrl

                  // Redirect to the IPG gateway
                  const form = document.createElement('form');
                  form.method = 'POST';
                  form.action = response.paymentUrl;

                  Object.keys(response.paymentData).forEach((key) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = response.paymentData[key];
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
      email: this.registrationData?.email || '',
      mobile_no: this.registrationData?.mobile_no || '',
      name: this.registrationData?.name || '',
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
