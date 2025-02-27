import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';

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
  constructor(
    private fb: FormBuilder,
    private delegateService: DelegateService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private encryptionService: EncryptionService
  ) { }
  ngOnInit() {
    this.initializeForms();
    this.checkQueryParams();
    this.setupFormSubscriptions();
  }
  private encrypt(text: string): string {
    return this.encryptionService.encrypt(text);
  }
  private decrypt(encryptedText: string): string {
    return this.encryptionService.decrypt(encryptedText);
  }

  private initializeForms() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
    this.completeProfileForm = this.fb.group({
      title: ['', Validators.required],
      dob: ['', Validators.required],
      profession: ['', Validators.required],
      organization_name: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
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
        } else {          
          this.isPaymentStatus = 'failed';          
        }
      },
      error: (err) => console.error('Error verifying session:', err),
    });
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
  checkFormValidity() {
    if (this.userForm.valid) {
      //this.createDelegateOnline();
    }
  }
  async handlePaymentSuccess() {

    await this.verifySession();


  
    if (this.registrationData && this.paymentSuccess) {
      this.userForm.patchValue({
        name: this.registrationData.name,
        email: this.registrationData.email,
        mobile: this.registrationData.mobile_no
      });
    }
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
    this.router.navigate(['/delegate-registration'], {
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
}
