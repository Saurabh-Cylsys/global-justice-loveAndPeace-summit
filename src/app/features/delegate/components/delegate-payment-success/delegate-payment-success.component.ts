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

interface PeaceStudentData {
  studentTitle: string
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentMobileNumber: string;
  studentCountry_id: string;
  studentDob:string;
  studentRelation:string;
  studentInstituteName :string
  adultTitle: string;
  adultFirstName: string;
  adultLastName: string;
  adultEmail: string;
  adultMobileNumber: string;
  adultCountryId: string;
  transcation_id: string;
  transcation_json: any;

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
  peaceStudentData: PeaceStudentData | null = null;
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
  pType: any;

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
        this.pType = params['p_type'];
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
      sessionId: this.sessionId,
      p_type: this.pType

    }

    this.delegateService.postVerifySession(body).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('Response:', response);
        if (response.success) {

          this.isPaymentStatus = response.session.payment_status;

          if(this.pType == 'DELEGATE_CHILD_NOMINATION'){
            let peaceStudentData = response.savedDetails[0].nominations[0];
            let adultData = response.savedDetails[0].parent_details[0];
            this.peaceStudentData = {
              studentTitle: peaceStudentData.title_nom,
              studentFirstName: peaceStudentData.first_name_nom,
              studentLastName: response.savedDetails.last_name_nom || '',
              studentEmail: response.savedDetails.email_id_nom || '',
              studentMobileNumber: response.savedDetails.studentMobileNumber || '',
              studentCountry_id: response.savedDetails.studentCountry_id || '',
              studentDob: response.savedDetails.studentDob || '',
              studentRelation: response.savedDetails.studentRelation || '',
              studentInstituteName: response.savedDetails.studentInstituteName || '',

              adultTitle: adultData.title,
              adultFirstName: adultData.first_name,
              adultLastName: adultData.last_name || '',
              adultEmail: adultData.email_id || '',
              adultMobileNumber: response.savedDetails.adultMobileNumber || '',
              adultCountryId: response.savedDetails.adultCountryId || '',
              transcation_id: response.session.payment_intent || '',
              transcation_json: response.session.status || '',
            };
          }

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
      error: (err) => {
        this.loading = false;
        console.log('Error verifying session:', err.error);
        this.sharedService.ToastPopup(err['error'], '', 'error');
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

    if(this.pType == 'DELEGATE_ONLINE'){
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
   else if(this.pType == 'DELEGATE_OFFLINE'){
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
    sessionStorage.setItem('IsOffline', 'true');
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
    else if(this.pType == 'DELEGATE_CHILD_NOMINATION'){
      debugger;
      const params = {
        studentTitle: this.peaceStudentData?.studentTitle,
        studentFirstName: this.peaceStudentData?.studentFirstName,
        studentLastName : this.peaceStudentData?.studentLastName || '',
        studentEmail: this.peaceStudentData?.studentEmail || '',
        studentMobileNumber: this.peaceStudentData?.studentMobileNumber || '',
        studentCountryId: this.peaceStudentData?.studentCountry_id || '',
        studentDob : this.peaceStudentData?.studentDob || '',
        studentRelation : this.peaceStudentData?.studentRelation || '',
        studentInstituteName : this.peaceStudentData?.studentInstituteName || '',

        adultTitle: this.peaceStudentData?.adultTitle,
        adultFirstName: this.peaceStudentData?.adultFirstName,
        adultLastName: this.peaceStudentData?.adultLastName || '',
        adultEmail: this.peaceStudentData?.adultEmail || '',
        adultMobileNumber: this.peaceStudentData?.adultMobileNumber || '',
        adultCountryId: this.peaceStudentData?.adultCountryId || '',
        transcation_id: this.peaceStudentData?.transcation_id || '',
        transcation_json: this.peaceStudentData?.transcation_json || '',

        IsChildNomination: true,

      };
      sessionStorage.setItem('IsChildNomination', 'false');
      const encryptedParams = this.encryptionService.encryptData(params);
      this.router.navigate(['/delegate-student-nomination'], {
        queryParams: { data: encryptedParams },
      });
    }

  }
}
