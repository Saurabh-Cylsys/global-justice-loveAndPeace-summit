import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';

interface RegistrationData {
  name: string;
  email: string;
  mobile_no: string;
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

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { '': 'rakesh.gupta.pc' }, // Customize the URL          
          replaceUrl: true // Replace the current URL in the browser history
        });
      }
    });
  }

  async ngOnInit() {
    await this.getAllCountries();
    this.initializeForms();
    this.checkQueryParams();
    this.setupFormSubscriptions();

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
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(7)]],
      country: [null, Validators.required],
      countrySearch: [''],
      dob: ['', [Validators.required, this.ageValidator]],
      reference_no: [this.referralCode ? this.referralCode : ''],
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
          mobile_no: params['mobile_no']
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
              mobile: this.registrationData.mobile_no
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
        mobile_no: `${String(this.userForm.get('countryCode')?.value).replace(/[^0-9]/g, '')}${String(this.userForm.get('mobile')?.value).replace(/[^0-9]/g, '')}`
      };

      this.delegateService.postDelegateOnline(payload).subscribe({
        next: (response: any) => {
          console.log('Delegate created successfully:', response);
          this.sharedService.ToastPopup('Success', response.message, 'success');
          this.registrationData = payload;
          setTimeout(() => {
            if (response.payment_link) {
              localStorage.setItem('delegateRegistration', JSON.stringify(payload));
              window.location.href = response.payment_link;
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
}
