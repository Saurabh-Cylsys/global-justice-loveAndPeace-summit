import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router,ActivatedRoute  } from '@angular/router';
import { DelegateService } from '../../services/delegate.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';

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
  department: string = '';
  designation: string = '';
  mobile_number: string = '';
  email_id: string = '';
  company_name: string = '';
  company_address: string = '';
  address_line_1: string = '';
  address_line_2: string = '';
  address_line_3: string = '';
  pin_code: string = '';
  website: string = '';
  represent_pharmaceutical_industry: string = '';
  manufacturing_solution_PI: string = '';
  part_of_product: string = '';
  attending_purpose: string = '';
  specific_solution: string = '';
  attended_innopack: string = '';
  fullURL: string;
  othervalstate: any='';
  othervalstate_id:any='';
  
  othervalcity: any='';
  othervalcity_id:any='';
  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private DelegateService: DelegateService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private httpClient: HttpClient,private route: ActivatedRoute) {
    this.fullURL = window.location.href;
    console.log('Full URL:', this.fullURL);
   }
  getcontrol(name: any): AbstractControl | null {
    return this.registrationForm.get(name);
  }
  get f() { return this.registrationForm.controls; }
  ngOnInit(): void {
  
    this.getdates()
    this.getAllCountries()
    this.getAllCountrycode()
    this.registrationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      department: [''],
      designation: ['', [Validators.required]],
      country_code: ['', [Validators.required]],

      mobile_number: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(), this.containsConsecutiveZeros()
      ]],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      company_name: ['', [Validators.required]],
      company_address: [''],
      address_line_1: ['', [Validators.required]],
      address_line_2: [''],
      address_line_3: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pin_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/), this.containsConsecutiveZeros()]],
      website: ['', [Validators.pattern('https?://.+')]], // Basic URL pattern validation
      conference_day: ['', [Validators.required]],
      // organization_role: [''],
      // represent_pharmaceutical_industry: ['', [Validators.required]],
      // manufacturing_solution_PI: ['', [Validators.required]],
      // part_of_product: ['', [Validators.required]],
      attending_purpose: ['', [Validators.required]],
      specific_solution: ['', [Validators.required]],
      attended_innopack: ['', [Validators.required]],
      // firm_teamsize: [''],
      status: ['0'],
      registration_type: ['1'],
      terms_condition: ['', [Validators.required]],
      is_whatsapp_number: ['', [Validators.required]],
      events: [''],
      
    });

  }


  getdates(){
    this.DelegateService.getdates().subscribe((res: any) => {
      console.log("dates", res.data);
      this.dates = res.data;
    }, (err:any) => {
      console.log("error", err);
    });
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

  getAllCountries() {
    this.DelegateService.getAllCountries().subscribe((res: any) => {
      console.log("CountryData1", res.data);
      this.countryData = res.data;
    }, (err: any) => {
      console.log("error", err);
    });
  }

  changeCountry(e: any) {
    
    this.country_id = e.target.value;
    this.isOthersSelected = this.country_id === '247'; // Set a flag for "Others"
    console.log(this.country_id);
    if(this.country_id==='247'){
      console.log("hii",this.country_id);
      this.DelegateService.getAllStates(this.country_id).subscribe((res: any) => {
        this.ngxService.stop();
        this.statesData = res.data;
        console.log(this.statesData[0].state_name);
      this.othervalstate=this.statesData[0].state_name;
      this.othervalstate_id=this.statesData[0].state_id;
      this.registrationForm.patchValue({
          state:this.statesData[0].state_id
        })

        this.DelegateService.getAllCities(this.othervalstate_id).subscribe((res: any) => {
          this.ngxService.stop();
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
        this.ngxService.stop();
      });
      
    }
    else{
      
      this.othervalstate_id='';
      this.othervalstate = '';
      this.othervalcity_id='';
      this.othervalcity='';
      console.log(typeof(this.othervalcity),this.othervalstate);
      
    this.ngxService.start();
    this.DelegateService.getAllStates(this.country_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.statesData = res.data;
    }, (err: any) => {
      console.log("Err", err);
      this.ngxService.stop();
    });
  }
  }

  changeStates(e: any) {
    this.state_id = e.target.value;
    this.ngxService.start();
    this.DelegateService.getAllCities(this.state_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.cityData = res.data;
    });
  }


  changeCity(e: any) {
    this.city_id = e.target.value;
    console.log("state", e.target.value);
  }


  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
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


onKeyDown(event: KeyboardEvent, inputValue: string): void {
  // Check if the pressed key is the space bar and the input is empty
  if (event.key === ' ' && inputValue.trim() === '') {
    event.preventDefault(); // Prevent the space character from being typed
  }
}

  submitData(): void {
    console.log(this.registrationForm.value);

    this.submitted = true;
    if (this.registrationForm.invalid) {
      return console.log('Invalid Details');
    }
    if (this.submitted) {
      const { valid } =
        this.registrationForm;
      if (valid) {
        this.reqBody = {
          ...this.registrationForm.value,
          refrence_url:this.fullURL,
      created_by:"user"
        };
        console.log("this.registrationForm.value", this.registrationForm.value);

        this.ngxService.start();
        this.SharedService.registration(this.reqBody).subscribe(async (result: any) => {
          if (result.success) {
            console.log("result", result);
            this.ngxService.stop();
            // this.SharedService.ToastPopup('Delegate added successfully','', 'success')
            this.SharedService.ToastPopup('', result.message, 'success')
           
            this.openPopup();
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   // this.router.navigateByUrl('/webhome');
            //   // Show the popup message
           
            // });
          } else {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'error')

          }
        },
        );
      }
      else {
        return this.registrationForm.reset({});
      }

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
  this.router.navigateByUrl('/webhome')
}


}

