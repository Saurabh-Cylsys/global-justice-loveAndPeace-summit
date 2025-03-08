import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { DatePipe, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface RegistrationData {
  name: string;
  email: string;
  mobile_no: string;
  country_id:string;
}

@Component({
  selector: 'app-delegate-payment-success',
  templateUrl: './delegate-payment-success.component.html',
  styleUrls: ['./delegate-payment-success.component.css']
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
  colorTheme: string = "theme-dark-blue";
  minDate1:any;
  maxDate1:any;
  isBackNavigation: boolean = false;
  transactionId: any;

  constructor(
    private fb: FormBuilder,
    private delegateService: DelegateService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private encryptionService: EncryptionService,
    private ngxService:NgxUiLoaderService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params != undefined && Object.keys(params).length > 0) {
        this.transactionId = params.txnId;

        // this.router.navigate([], {
        //   relativeTo: this.route,
        //   queryParams: { '': 'rakesh.gupta.pc' }, // Customize the URL
        //   replaceUrl: true // Replace the current URL in the browser history
        // });

        //api call


      }
    });

    this.locationStrategy.onPopState((event) => {
      if (event.type === 'popstate') {
        this.isBackNavigation = true;
        this.handleBackNavigation();
      }
    });
  }

  ngOnInit(){
    this.getUserDataByTransactionId();
  }

  getUserDataByTransactionId(){
    this.delegateService.getDataByTransactionIdApi(this.transactionId).subscribe((response: any)=> {
      if (response && response.status === 200) {
        this.registrationData = response.data;
        this.showPaymentSuccess = true;
      } else {
        this.showPaymentSuccess = false;
      }
    },(err)=>{
      console.log(err.error);
      this.sharedService.ToastPopup(err.error.message,'','error');
    });
  }


  private handleBackNavigation() {
    // Clear stored data
    localStorage.removeItem('delegateRegistration');

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

}
