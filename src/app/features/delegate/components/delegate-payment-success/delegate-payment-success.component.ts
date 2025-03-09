import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { DatePipe, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface RegistrationData {
  title: string
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  transcation_id: string;
  transcation_json: any;
  country_id: string;
}

@Component({
  selector: 'app-delegate-payment-success',
  templateUrl: './delegate-payment-success.component.html',
  styleUrls: ['./delegate-payment-success.component.css'],
})
export class DelegatePaymentSuccessComponent {
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
  colorTheme: string = 'theme-dark-blue';
  minDate1: any;
  maxDate1: any;
  isBackNavigation: boolean = false;
  transactionId: any;

  constructor(

    private delegateService: DelegateService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private encryptionService: EncryptionService,
  ) {
    // Prevent browser back navigation to payment URL
    history.pushState(null, '', window.location.href);
    
    this.route.queryParams.subscribe((params: any) => {
      if (params != undefined && Object.keys(params).length > 0) {
        this.sessionId = params['session_id'] || 'No session_id';
        if (this.sessionId != 'No session_id' && this.sessionId != '') {
          this.verifySession();
        }
        else {
          this.transactionId = params.txnId;
          this.getUserDataByTransactionId();
        }
      }
    });

    // Handle browser back button
    window.addEventListener('popstate', () => {
      this.handleBackNavigation();
    });
  }

  ngOnInit() {

  }

  getUserDataByTransactionId() {
    this.loading = true;
    this.delegateService
      .getDataByTransactionIdApi(this.transactionId)
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response) {
            this.registrationData = response.data[0];
            console.log(this.registrationData);
            this.showPaymentSuccess = true;
          } else {
            this.showPaymentSuccess = false;
          }
        },
        (err) => {
          this.loading = false;
          console.log(err.error);
          this.sharedService.ToastPopup(err.error.message, '', 'error');
        }
      );
  }

  verifySession() {
    this.loading = true;
    let body = {
      // sessionId: "cs_test_a1wx1VFhgcGnSFpvXZ36uXOna2QbD3gYfXdi1ZefYj9MYOwUv6bpj1v2Ak"
      sessionId: this.sessionId

    }
    this.delegateService.postVerifySession(body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {         
          this.isPaymentStatus = response.session.payment_status;
          this.registrationData = {
            title: '',
            first_name: '',
            last_name: '',
            email: response.session.customer_email || '',
            mobile_number: '',
            transcation_id: response.session.payment_intent || '',
            transcation_json: { status: response.session.status || '' },
            country_id: ''
          };
          if (this.registrationData) {
            this.registrationData.email = response.session.customer_email;
            this.registrationData.transcation_id =response.session.payment_intent;
            this.registrationData.transcation_json.status = response.session.status;
            this.registrationData = {
              title: response.savedDetails.title,
              first_name: response.savedDetails.first_name,
              last_name: response.savedDetails.last_name,
              email: response.savedDetails.email_id || '',
              mobile_number: response.savedDetails.mobile_number,
              transcation_id: response.session.payment_intent || '',
              transcation_json: { status: response.session.status || '' },
              country_id: response.savedDetails.country_id
            };
          }
          this.transactionVerified = true;
          this.showPaymentSuccess = true;
        } else {          
          this.isPaymentStatus = 'failed';         
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error verifying session:', err);
      },
    });
  }


  private handleBackNavigation() {
    // Prevent default back navigation
    history.pushState(null, '', window.location.href);

    // Clear all stored data
    localStorage.removeItem('delegateRegistration');
    sessionStorage.removeItem('IsOnline');
    sessionStorage.removeItem('pendingPayment');

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

    // Navigate to peacekeeper-preselect page and replace URL in history
    this.router.navigate(['/peacekeeper-preselect'], { replaceUrl: true });
  }

  showCompleteProfile() {
    const params = {
      title: this.registrationData?.title,
      email: this.registrationData?.email || '',
      mobile_no: this.registrationData?.mobile_number || '',
      name:
        this.registrationData?.first_name +
        ' ' +
        this.registrationData?.last_name || '',
      country_id: this.registrationData?.country_id || '',
      isOnline: true,
    };
    sessionStorage.setItem('IsOnline', 'true');
    const encryptedParams = this.encryptionService.encryptData(params);
    this.router.navigate(['/delegate-registration-online'], {
      queryParams: { data: encryptedParams },
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
}
