import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  helpjustice = 'help@justice-love-peace.com';
  code: any;
  contactUsForm: any = FormGroup;
  reqBody: any;
  submitted = false;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  selectedCountryISO: any;
  mobile_number: string = '';
  mobile_numberVal:boolean= false;


  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

  constructor( private formBuilder: FormBuilder, private DelegateService: DelegateService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private httpClient: HttpClient,private route: ActivatedRoute) {

   }
   getcontrol(name: any): AbstractControl | null {
    return this.contactUsForm.get(name);
  }
  get f() { return this.contactUsForm.controls; }
  ngOnInit(): void {
    // this.getAllCountrycode()

    this.contactUsForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      countryCode: [''],
      phoneNumber: ['',[Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      yourQuestion: [''],

    });

    console.log(this.contactUsForm.value,'contect');


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

  containsConsecutiveZeros(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && /000000/.test(value)) {
        return { containsConsecutiveZeros: true };
      }
      return null;
    };
  }
  getAllCountrycode() {
    this.DelegateService.getAllCountrycode().subscribe((res: any) => {
      console.log("code", res.data);
      this.code = res.data;
      // Define the country name you want to find (e.g., "India (+91)")
const countryToFind = "India (+91)";

// Find the object that matches the country name
const indiaCodeObject =  this.code.find((item:any) => item.country_mobile_code === countryToFind);
console.log(indiaCodeObject);

      this.contactUsForm.patchValue({
        countryCode :indiaCodeObject.country_mobile_code
      })
    }, (err: any) => {
      console.log("error", err);
    });
  }

  onKeyDown(event: KeyboardEvent, inputValue: any): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && event.code === 'Space') {
      event.preventDefault(); // Prevent the space character from being typed
    }else  if (event.code === 'Backspace') {
      if(inputValue.number.length<10){
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
    }
  
  }

 
  keyPressNumbers(event: KeyboardEvent, inputValue: any) {
    debugger
    if(inputValue !== null){
      
      if(inputValue.number.length<10){
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
      
     }
   
  }


  submitData(): void {

    const rawMobileNumber = this.contactUsForm.value.phoneNumber.number;
    const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces
    console.log(formattedMobileNumber);
        
    this.contactUsForm.patchValue({
      countryCode :this.contactUsForm.value.phoneNumber.countryCode,
      phoneNumber :this.contactUsForm.value.phoneNumber.dialCode + ' ' + formattedMobileNumber
    })
    console.log(this.contactUsForm.value);
    this.submitted = true;
    if (this.contactUsForm.invalid) {
      return console.log('Invalid Details');
    }
    if (this.submitted) {
     
        this.reqBody = {
          ...this.contactUsForm.value,
        };
        console.log("this.contactUsForm.value", this.contactUsForm.value);
        this.ngxService.start();
        this.SharedService.contectUs(this.reqBody).subscribe((result: any) => {
          if (result.success) {
            console.log("result", result);
            this.ngxService.stop();
            this.contactUsForm.reset();
            this.SharedService.ToastPopup('', result.message, 'success')        
           
          } 
        },(err) => {
          this.ngxService.stop();
  
     
            this.SharedService.ToastPopup('', err.error.message, 'error')

          
        }
        );
     

    }
  }

}
