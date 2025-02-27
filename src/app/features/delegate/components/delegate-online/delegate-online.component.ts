import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) { }
  ngOnInit() {
    this.initializeForms();
    this.checkQueryParams();
    this.setupFormSubscriptions();
  }
  private initializeForms() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      mobile: ['', Validators.required]
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
          name: decodeURIComponent(params['name'] || ''),
          email: decodeURIComponent(params['email'] || ''),
          mobile_no: decodeURIComponent(params['mobile_no'] || '')
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

  verifySession() {
    let body = {      
      sessionId: this.sessionId
    }
    this.delegateService.postVerifySession(body).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Session Verified:', response.session);
          this.isPaymentStatus = response.session.status;
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
        mobile_no: `${this.userForm.get('countryCode')?.value}${this.userForm.get('mobile')?.value}`
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
  handlePaymentSuccess() {
    this.showPaymentSuccess = true;
    this.paymentSuccess = true;
    if (this.registrationData) {
      this.userForm.patchValue({
        name: this.registrationData.name,
        email: this.registrationData.email,
        mobile: this.registrationData.mobile_no
      });
    }
  }
  showCompleteProfile() {
    //this.showCompleteProfileForm = true;
    this.router.navigate(['/delegate-registration'], {
      queryParams: {
        email: this.registrationData?.email,
        mobile_no: this.registrationData?.mobile_no,
        name: this.registrationData?.name,
        isOnline: true
      }
    });
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
