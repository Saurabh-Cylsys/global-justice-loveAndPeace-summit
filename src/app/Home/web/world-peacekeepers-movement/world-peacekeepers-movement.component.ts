import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import html2canvas from 'html2canvas';
import int1TelInput from 'intl-tel-input';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';


@Component({
  selector: 'app-world-peacekeepers-movement',
  templateUrl: './world-peacekeepers-movement.component.html',
  styleUrls: ['./world-peacekeepers-movement.component.css']
})
export class WorldPeacekeepersMovementComponent implements OnInit{

  peacekeepersForm: any = FormGroup;
  reqBody: any;
  formdisplay:boolean=true;
  showPopup: boolean = false;
  display:string='';
  code: any;
  submitted = false;
  is_selectedFile = false;
  countryData:any;
  fileUrl:any

  selectedFile: File | null = null;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  selectedCountryISO: any;
peacekeeperData:any = [];
peacekeeperBadgeId:any
isCheckEmail:boolean=true;

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

  // configOption: ConfigurationOptions = new ConfigurationOptions;

  constructor( private formBuilder: FormBuilder,
     private DelegateService: DelegateService,
      private SharedService: SharedService,
       private ngxService: NgxUiLoaderService,
        private router: Router,
    private route: ActivatedRoute) {
    //   this.configOption.SelectorClass = "OptionType3";
    //   this.configOption.OptionTextTypes = [];
    // this.configOption.OptionTextTypes.push(ContentOptionsEnum.Flag);
    // this.configOption.OptionTextTypes.push(ContentOptionsEnum.CountryName);
    // this.configOption.OptionTextTypes.push(ContentOptionsEnum.CountryPhoneCode);
    }
  
   getcontrol(name: any): AbstractControl | null {
    return this.peacekeepersForm.get(name);
  }
  get f() { return this.peacekeepersForm.controls; }
  @ViewChild('contentTemplate')
  contentTemplate!: TemplateRef<any>;

  country_code_val(){

    console.log(this.peacekeepersForm.value.phone.number,this.peacekeepersForm.value.dialCode)
      }
 
  ngOnInit(): void {

    // this.getAllCountrycode()
    const inputElement = document.getElementById('phone') as HTMLInputElement;
    console.log(inputElement,'inputElement');
    
    if (inputElement) {
      
      const data =
    int1TelInput(inputElement,{
    initialCountry: 'ae',
    separateDialCode:true,
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js'
    });
    inputElement.addEventListener('countrychange', () => {
      console.log(data);
      
      this.countryData =  int1TelInput(inputElement,{
        initialCountry: 'ae',
        separateDialCode:true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js'
        }).getSelectedCountryData();
      console.log('Selected Country Code:', this.countryData.dialCode);
      console.log('Selected Country ISO Code:', this.countryData.iso2);
    });
  }

    this.peacekeepersForm = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      country_code: [''],
      mobile_number: ['', [Validators.required]],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      is_active: 1,
      Check_email:['']
    });

    
//     console.log('Form Controls:', this.peacekeepersForm.controls);
// Object.keys(this.peacekeepersForm.controls).forEach((key) => {
//   const control = this.peacekeepersForm.get(key);
//   console.log(`${key}:`, {
//     value: control?.value,
//     valid: control?.valid,
//     errors: control?.errors,
//   });
// });
    
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      console.log('Dropped file:', this.selectedFile);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    // Add a visual cue for the drag-over state (e.g., border highlight)
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    // Remove the visual cue for the drag-over state
  }

  // Handle the file selection from the input element
  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.is_selectedFile = true;

      console.log('Selected file:', this.selectedFile);
    }
  }

  downloadImage() {
    
    // Capture the template content as an HTML element
    const element:any = document.getElementById('capture');
    
    // Use html2canvas to capture the content of the element
    html2canvas(element).then((canvas) => {
      // Convert the canvas to a data URL (JPEG or PNG)
      const imageUrl = canvas.toDataURL('image/png'); // or 'image/jpeg' for JPEG
      
      // Create a link to download the image
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'template-image.png'; // Set the filename for the download
      link.click();
      this.display = "none";
      this.showPopup=false;
      this.formdisplay=true;
      
    });
  }
  openPopup() {
    if(this.peacekeeperBadgeId){
      let id = this.peacekeeperBadgeId
      this.DelegateService.getPeacekeeper_Badge(id).subscribe((res: any) => {
      this.peacekeeperData = res.data;
      this.fileUrl =  this.peacekeeperData.file_urls[0]
        
    });
  }
  console.log("modal peacekeeperData",this.peacekeeperData);
    
  
    this.showPopup=true;
    this.display='block'
    this.formdisplay=false;
}
  closeModal() {
    this.display = "none";
    this.showPopup=false;
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
  
      this.peacekeepersForm.patchValue({
        country_code :indiaCodeObject.country_mobile_code
      })
    }, (err: any) => {
      console.log("error", err);
    });
  }
  // profile_picture:[''],

  onFileChange(event: any): void {
    
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.is_selectedFile =true;
    }
  }

  extractCountryCode(inputString: string): string | null {
    const countryCodeMatch = inputString.match(/\(\+(\d+)\)/);
    return countryCodeMatch ? `+${countryCodeMatch[1]}` : null;
  }
  submitData(): void {

    console.log(this.peacekeepersForm.value.mobile_number.number,this.peacekeepersForm.value.mobile_number.dialCode)
  
  
      const inputString = this.peacekeepersForm.value.country_code;
      const countryCode = this.extractCountryCode(inputString);
      console.log(countryCode); // Output: +91
      this.isCheckEmail = this.peacekeepersForm.value.Check_email
    this.peacekeepersForm.patchValue({
      is_active :1,
      Check_email:this.peacekeepersForm.value.Check_email == true? 1 : 0,
      country_code: this.peacekeepersForm.value.mobile_number.countryCode,
      mobile_number: this.peacekeepersForm.value.mobile_number.dialCode + ' ' + this.peacekeepersForm.value.mobile_number.number
    })
    console.log(this.peacekeepersForm.value);
    // if (this.peacekeepersForm.invalid) {
      //   return console.log('Invalid Details');
      // }
      
      // Create FormData object
      const formData = new FormData();
      
      // Append all form fields except the file
      Object.keys(this.peacekeepersForm.value).forEach((key) => {
    formData.append(key, this.peacekeepersForm.value[key]);
  });
  
  // Append the selected file
  if (this.selectedFile) {
    formData.append('profile_picture', this.selectedFile, this.selectedFile.name);
  }
  console.log("this.peacekeepersForm", formData);
  
  // Show loader
  this.ngxService.start();
  
  // Call the service to submit data
  this.SharedService.postPeacekeeper(formData).subscribe(
    (response:any) => {          
      
      if (response.success) {
        this.submitted = true;
      console.log("response", response);
this.peacekeeperBadgeId = response.peacekeeper_id
      this.ngxService.stop();
      this.SharedService.ToastPopup('', response.message, 'success')
      this.peacekeepersForm.reset();
    } else {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', response.message, 'error')

    }
  },(err) => {
    this.ngxService.stop();


      this.SharedService.ToastPopup('', err.error.message, 'error')

    
  }
  );
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

}

