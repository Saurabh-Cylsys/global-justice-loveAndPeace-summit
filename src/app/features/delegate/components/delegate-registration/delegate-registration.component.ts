import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router,ActivatedRoute  } from '@angular/router';
import { DelegateService } from '../../services/delegate.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';


@Component({
  selector: 'app-delegate-registration',
  templateUrl: './delegate-registration.component.html',
  styleUrls: ['./delegate-registration.component.css']
})
export class DelegateRegistrationComponent {
  showPopup: boolean = false;
  formdisplay:boolean=true;
  display:string='';
  isOthersSelected:any;
  reqBody: any;
  registrationForm: any = FormGroup;
  submitted = false;
  repositoryForm: any = FormGroup;
  country_id: any
  state_id: any
  cities: any;
  states: any;
  countries: any;
  country:any;
  countryData: any;
  statesData: any;
  cityData: any;
  city_id: any;
  code: any;
  dates: any;
  terms: any;
  terms1: any;
  first_name: string = '';
  last_name: string = '';
  mobile_number: string = '';
  mobile_numberVal:boolean= false;
  email_id: string = '';
  linkedIn_profile: string = '';
  instagram_profile: string = '';
  profession_1: string = '';
  profession_2: string = '';
  address: string = '';
  pin_code: string = '';
  website: string = '';
  represent_pharmaceutical_industry: string = '';
  manufacturing_solution_PI: string = '';
  fullURL: string;
  othervalstate: any='';
  othervalstate_id:any='';
  
  othervalcity: any='';
  othervalcity_id:any='';

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  selectedCountryISO: any;
  formattedDate: string = '';
  referralCode:any='';
  conferenceInterest:any
  conferenceInterestArr:any
  minDate: string| null = null;
  maxDate: string | null = null;
  isMobileView = false;
  interests = [
    { value: 'Justice', label: 'Justice' },
    { value: 'Love', label: 'Love' },
    { value: 'Peace', label: 'Peace' }
  ];

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  constructor(private datePipe: DatePipe,
     private formBuilder: FormBuilder, 
     private DelegateService: DelegateService, 
     private SharedService: SharedService, 
     private ngxService: NgxUiLoaderService, 
     private router: Router, 
     private httpClient: HttpClient,
     private route: ActivatedRoute) {
    this.fullURL = window.location.href;
    console.log('Full URL:', this.fullURL);
   }
  getcontrol(name: any): AbstractControl | null {
    return this.registrationForm.get(name);
  }
  get instagramProfileControl() {
    return this.registrationForm.get('instagram_profile');
  }
  isInvalidInstagramProfile() {
    return this.instagramProfileControl.hasError('pattern') && this.instagramProfileControl.touched;
  }
  get f() { return this.registrationForm.controls; }




  ngOnInit(): void {
    this.checkWindowSize();
  this.dobValidator();

    this.route.queryParams.subscribe((params:any) => {
      if(params){
        this.referralCode = params.code;
      }
      if(this.referralCode){

        console.log(this.referralCode,'referralCode..........');
      }
      
    });
    
    this.createForm();
  


    // this.getdates()
    // this.getAllCountries()
    // this.getAllCountrycode()

 

  }

  createForm(){
    this.registrationForm = this.formBuilder.group({
      title: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      country_code: [''],

      mobile_number: ['', [ Validators.minLength(7), Validators.required]],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      // linkedIn_profile:['', [Validators.pattern('https?://.+')]],
      // instagram_profile:['', [Validators.pattern('https?://.+')]],
      linkedIn_profile:[''],
      instagram_profile:[''],
      // instagram_profile:['', [ Validators.pattern('^(https?:\\/\\/(www\\.)?(instagram\\.com\\/|linkedin\\.com\\/[^\\/]+\\/public-profile\\/settings\\?trk=.+)|[a-zA-Z0-9._]+)$')]],
      profession_1: ['', [Validators.required]],// need 
      profession_2: [''],// need 
      website: ['', [Validators.pattern('^[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$')]], // Basic URL pattern validation
      organization_name: [''],// need 
      address: [''],
      country: ['', [Validators.required]],
      state: [''],
      city: ['', [Validators.required]],
      passport_no: [''],// need 
      passport_issue_by: [''],// need 
      pin_code: [null],
      // attend_summit: ['0', [Validators.required]],
      reference_no: [this.referralCode?this.referralCode:''],// need 
      attendee_purpose: ['0', [Validators.required]],
      conference_lever_interest: [[], [Validators.required]], // Initialize as empty array

      created_by: "Admin",
      status: ['0'],
    });
  }
//   getdates(){
//     this.DelegateService.getdates().subscribe((res: any) => {
//       console.log("dates", res.data);
//       this.dates = res.data;
//     }, (err:any) => {
//       console.log("error", err);
//     });
//   }

dobValidator() {
  const today = new Date();

const minYear = today.getFullYear() - 120; // 120 years ago
const eighteenYearsAgo = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);
this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];
this.minDate = `${minYear}-01-01`; // Set
 
}

onCheckboxChange(event: any) {
  const conferenceLeverInterest = this.registrationForm.get('conference_lever_interest');
  if (conferenceLeverInterest) {
    const currentValues = conferenceLeverInterest.value || [];
    if (event.target.checked) {
      // Add the value if checked
      conferenceLeverInterest.setValue([...currentValues, event.target.value]);
    } else {
      // Remove the value if unchecked
      conferenceLeverInterest.setValue(currentValues.filter((v: string) => v !== event.target.value));
    }
    conferenceLeverInterest.markAsTouched(); // Mark control as touched
  }
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

      this.registrationForm.patchValue({
        country_code :indiaCodeObject.country_mobile_code
      })
    }, (err: any) => {
      console.log("error", err);
    });
  }

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '';

  }

//   getAllCountries() {
//     this.DelegateService.getAllCountries().subscribe((res: any) => {
//       console.log("CountryData1", res.data);
//       this.countryData = res.data;
//     }, (err: any) => {
//       console.log("error", err);
//     });
//   }



  changeCountry(e: any) {
    
    this.country_id = e.target.value;
    this.isOthersSelected = this.country_id === '247'; // Set a flag for "Others"
    console.log(this.country_id);
    if(this.country_id==='247'){
      console.log("hii",this.country_id);
      this.DelegateService.getAllStates(this.country_id).subscribe((res: any) => {
        // this.ngxService.stop();
        this.statesData = res.data;
        console.log(this.statesData[0].state_name);
      this.othervalstate=this.statesData[0].state_name;
      this.othervalstate_id=this.statesData[0].state_id;
      this.registrationForm.patchValue({
          state:this.statesData[0].state_id
        })

        this.DelegateService.getAllCities(this.othervalstate_id).subscribe((res: any) => {
          // this.ngxService.stop();
          this.cityData = res.data;
          console.log(this.cityData[0].city_name);
          this.othervalcity=this.cityData[0].city_name;
          this.othervalcity_id=this.cityData[0].city_id;
          this.registrationForm.patchValue({
              city:this.cityData[0].city_id
            })
  
            console.log("c",this.registrationForm.value.city,this.othervalcity_id,this.othervalcity);
  
          }, (err: any) => {
            console.log("Err", err);
            this.ngxService.stop();
          });
  
    // this.otherval=    this.registrationForm.get('state')?.setValue(this.statesData[0].state_name);
      console.log("s",this.registrationForm.value.state,this.othervalstate_id,this.othervalstate);
      
      }, (err: any) => {
        console.log("Err", err);
        // this.ngxService.stop();
      });
      
    }
    else{
      
      this.othervalstate_id='';
      this.othervalstate = '';
      this.othervalcity_id='';
      this.othervalcity='';
      console.log(typeof(this.othervalcity),this.othervalstate);
      
    // this.ngxService.start();
    this.DelegateService.getAllStates(this.country_id).subscribe((res: any) => {
      // this.ngxService.stop();
      this.statesData = res.data;
    }, (err: any) => {
      console.log("Err", err);
      // this.ngxService.stop();
    });
  }
  }

  changeStates(e: any) {
    this.state_id = e.target.value;
    // this.ngxService.start();
    this.DelegateService.getAllCities(this.state_id).subscribe((res: any) => {
      // this.ngxService.stop();
      this.cityData = res.data;
    });
  }


  changeCity(e: any) {
    this.city_id = e.target.value;
    console.log("state", e.target.value);
  }



  keyPressNumbers(event: KeyboardEvent, inputValue: any) {
    if(inputValue !== null){
      
      if(inputValue.number.length<7){
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
      
     }
   
  }


  ValidateAlpha(event: any) {
    var keyCode = (event.which) ? event.which : event.keyCode

    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
      return false;
    return true;

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


  checkTerms(evt: any) {
    console.log(evt.target.checked);
    this.terms = evt.target.checked;
}

checkTerms1(evtt: any) {
  console.log(evtt.target.checked);
  this.terms1 = evtt.target.checked;
}


onMobileKeyDown(event: KeyboardEvent, inputValue: any): void {
  console.log(this.registrationForm);
  if(inputValue!==null){

  
  // Check if the pressed key is the space bar and the input is empty
  if (event.key === ' ' && event.code === 'Space') {
    event.preventDefault(); // Prevent the space character from being typed
  }else  if (event.code === 'Backspace') {
    if(inputValue.number.length<7){
      this.mobile_numberVal = true;
      // event.preventDefault()
    } else {
      this.mobile_numberVal = false;
    }
  }
  }

}
onKeyDown(event: KeyboardEvent, inputValue: any): void {
  // Check if the pressed key is the space bar and the input is empty
  if (event.key === ' ' && event.code === 'Space') {
    event.preventDefault(); // Prevent the space character from being typed
  }

}

  submitData(): void {
    debugger
    const rawMobileNumber = this.registrationForm.value.mobile_number.number;
const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces
console.log(formattedMobileNumber);
    
    this.registrationForm.patchValue({
      country_code :this.registrationForm.value.mobile_number.dialCode,
      mobile_number :formattedMobileNumber,
      // dob: this.formattedDate
    })
    console.log(this.registrationForm.value);

    this.submitted = true;
    // if (this.registrationForm.invalid) {
    //   return console.log('Invalid Details');
    // }
    if (this.submitted) {

        this.reqBody = {
          ...this.registrationForm.value,
        };
        console.log("this.registrationForm.value", this.registrationForm.value);
        this.ngxService.start();
        this.SharedService.registration(this.reqBody).subscribe(async (result: any) => {
          if (result.success) {
            console.log("result", result);
            // this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'success')
            this.registrationForm.reset();

            // this.openPopup();


          setTimeout(() => {

            console.log('get payment URL',result.url);
            this.ngxService.stop();
            if (result.url) {
              window.location.href = result.url; // Redirect to Stripe Checkout
            }
            
          }, 5000);
           
          } else {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'error')

          }
        },(err) => {
          this.ngxService.stop();
  
     
            this.SharedService.ToastPopup('', err.error.message, 'error')

          
        }
        );
     

    }
  }



 
  openPopup() {
    this.showPopup=true;
    console.log("modal open");
    this.display='block'
    this.formdisplay=false;
}

closeModal() {
  this.display = "none";
  this.showPopup=false;
  this.formdisplay=true;
  this.registrationForm.reset({});
  this.router.navigateByUrl('/home')
}

  checkWindowSize(): void {
    if (window.innerWidth <= 767) {
      this.SharedService.isMobileView.next(true);
      this.isMobileView = true;
    } else {
      this.SharedService.isMobileView.next(false);
      this.isMobileView = false;
    }
  }

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

}