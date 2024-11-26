import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SpeakerService } from '../../services/speaker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from 'src/app/Home/delegate/services/delegate.service';

@Component({
  selector: 'app-speaker-registration',
  templateUrl: './speaker-registration.component.html',
  styleUrls: ['./speaker-registration.component.css']
})


export class SpeakerRegistrationComponent {
  showPopup: boolean = false;
  isOthersSelected:any;
  othervalstate: any='';
  othervalstate_id:any='';
  
  othervalcity: any='';
  othervalcity_id:any='';
  formdisplay:boolean=true;
  display:string='';
  submitted = false;
  signUpData: any;
  countryData: any;
  country_id: any;
  statesData: any;
  state_id: any;
  cityData: any;
  city_id: any;
  code: any
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
  fullURL: string = '';

  ngOnInit(): void {
    // Set up form configurations
    this.getdates()
    this._createspeakerForm();
    this.getAllCountries()
    this.getAllCountrycode()
  }
  getdates() {
    this.DelegateService.getdates().subscribe((res: any) => {
      console.log("dates", res.data);
      this.dates = res.data;
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
      this.speakerForm.patchValue({
          state:this.statesData[0].state_id
        })

        this.DelegateService.getAllCities(this.othervalstate_id).subscribe((res: any) => {
          this.ngxService.stop();
          this.cityData = res.data;
          console.log(this.cityData[0].city_name);
          this.othervalcity=this.cityData[0].city_name;
          this.othervalcity_id=this.cityData[0].city_id;
          this.speakerForm.patchValue({
              city:this.cityData[0].city_id
            })
  
            console.log("c",this.speakerForm.value.city,this.othervalcity_id,this.othervalcity);
  
          }, (err: any) => {
            console.log("Err", err);
            this.ngxService.stop();
          });
  
    // this.otherval=    this.speakerForm.get('state')?.setValue(this.statesData[0].state_name);
      console.log("s",this.speakerForm.value.state,this.othervalstate_id,this.othervalstate);
      
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




  speakerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private SpeakerService: SpeakerService,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private DelegateService: DelegateService,

  ) {
    this.fullURL = window.location.href;
    console.log('Full URL:', this.fullURL);
  }

  private _createspeakerForm() {
    this.speakerForm = this.formBuilder.group({
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
      registration_type: ['3'],
      terms_condition: ['', [Validators.required]],
      is_whatsapp_number: ['', [Validators.required]],
      events: [''],

    },);
  }

  // Function to get the form control by name
  getcontrol(name: any): AbstractControl | null {
    return this.speakerForm.get(name);
  }

  // Getter for accessing the form controls
  get f() {
    return this.speakerForm.controls;
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

  getAllCountrycode() {
    this.DelegateService.getAllCountrycode().subscribe((res: any) => {
      console.log("code", res.data);
      this.code = res.data;
      // Define the country name you want to find (e.g., "India (+91)")
const countryToFind = "India (+91)";

// Find the object that matches the country name
const indiaCodeObject =  this.code.find((item:any) => item.country_mobile_code === countryToFind);
console.log(indiaCodeObject);

      this.speakerForm.patchValue({
        country_code :indiaCodeObject.country_mobile_code
      })
    }, (err: any) => {
      console.log("error", err);
    });
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
  signup() {

    let signUpData = {

      title: this.speakerForm.controls['title'].value,

      first_name: this.speakerForm.controls['first_name'].value,

      last_name: this.speakerForm.controls['last_name'].value,

      department: this.speakerForm.controls['department'].value,



      designation: this.speakerForm.controls['designation'].value,

      country_code: this.speakerForm.controls['country_code'].value,

      mobile_number: this.speakerForm.controls['mobile_number'].value,

      email_id: this.speakerForm.controls['email_id'].value,



      company_name: this.speakerForm.controls['company_name'].value,

      company_address: this.speakerForm.controls['company_address'].value,

      address_line_1: this.speakerForm.controls['address_line_1'].value,

      address_line_2: this.speakerForm.controls['address_line_2'].value,



      address_line_3: this.speakerForm.controls['address_line_3'].value,

      country: this.speakerForm.controls['country'].value,

      state: this.speakerForm.controls['state'].value,

      city: this.speakerForm.controls['city'].value,



      pin_code: this.speakerForm.controls['pin_code'].value,

      website: this.speakerForm.controls['website'].value,

      conference_day: this.speakerForm.controls['conference_day'].value[0],

      // organization_role: this.speakerForm.controls['organization_role'].value,



      // represent_pharmaceutical_industry: this.speakerForm.controls['represent_pharmaceutical_industry'].value,

      // manufacturing_solution_PI: this.speakerForm.controls['manufacturing_solution_PI'].value,

      // part_of_product: this.speakerForm.controls['part_of_product'].value,

      attending_purpose: this.speakerForm.controls['attending_purpose'].value,



      specific_solution: this.speakerForm.controls['specific_solution'].value,

      attended_innopack: this.speakerForm.controls['attended_innopack'].value,

      // firm_teamsize: this.speakerForm.controls['firm_teamsize'].value,

      is_whatsapp_number :this.speakerForm.controls['is_whatsapp_number'].value,
      terms_condition :this.speakerForm.controls['terms_condition'].value,
      status: '0',
      registration_type: '3',
      created_by: "user",
      refrence_url: this.fullURL,

    }


    this.ngxService.start();

    this.SharedService.registration(signUpData).subscribe((res: any) => {
      if (res.success) {
        console.log("res", res);
        this.ngxService.stop();
        // this.SharedService.ToastPopup('Delegate added successfully','', 'success')
        this.SharedService.ToastPopup('', res.message, 'success')
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //   this.router.navigateByUrl('/webhome');
        // });
        this.openPopup();
      } else {
        this.ngxService.stop();
        this.SharedService.ToastPopup('', res.message, 'error')
      }
    }, (err) => {

      this.ngxService.stop();

      // Display error message if OTP is not found or there's an error in API call
      console.log("err", err);

      this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');

    });

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
  this.speakerForm.reset({});
  this.router.navigateByUrl('/webhome');

}
}