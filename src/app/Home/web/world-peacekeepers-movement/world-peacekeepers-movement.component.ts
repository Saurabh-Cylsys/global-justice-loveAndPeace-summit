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
  showPopup: boolean= false;
  isPeaceOn: number = -1;
  display:string='';
  code: any;
  submitted = false;
  is_selectedFile = false;
  countryData:any;
  fileUrl:any
  isMobile:any
  mobile_number: string = '';
  mobile_numberVal:boolean= false;

  selectedFile: File | null = null;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  defaultCountryISO: any;
  selectedCountryISO: any;
peacekeeperData:any = [];
peacekeeperBadgeId:any
isCheckEmail:boolean=true;
previewUrl: string | null = null; // Add this to your component


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
         this.defaultCountryISO = CountryISO.UnitedArabEmirates
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

    this.getAllCountrycode()
    this.mobile_numberVal = false;
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
      dob: ['', [Validators.required]],
      country: ['', [Validators.required]],
      country_code: [''],
      mobile_number: ['', [Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(), this.containsConsecutiveZeros()
      ]],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      is_active: 1,
      Check_email:['']
    });

     
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


  dobValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const today = new Date();

    if (!control.value) {
      return null; // No validation error if input is empty
    }

    // Calculate age
    const age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    const dayDiff = today.getDate() - inputDate.getDate();

    // Check if the age is less than 18
    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return { underage: true }; // Fail if under 18
    }

    return null; // Valid if 18 or older
  }

  get dob() {
    return this.peacekeepersForm.get('dob');
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
    
    // // Capture the template content as an HTML element
    // const element:any = document.getElementById('capture');
    
    // // Use html2canvas to capture the content of the element
    // html2canvas(element).then((canvas) => {
    //   // Convert the canvas to a data URL (JPEG or PNG)
    //   const imageUrl = canvas.toDataURL('image/png'); // or 'image/jpeg' for JPEG
      
    //   // Create a link to download the image
    //   const link = document.createElement('a');
    //   link.href = imageUrl;
    //   link.download = 'template-image.png'; // Set the filename for the download
    //   link.click();
    //   this.display = "none";
    //   this.showPopup=false;
    //   this.formdisplay=true;
      
    // });


    const element: HTMLElement | null = document.getElementById('capture');
    if (!element) {
      console.error('Element not found for capturing!');
      return;
    }
  

    // this.isLoading = true; // Show a loading spinner if needed

    html2canvas(element, {
      useCORS: true, // Ensures cross-origin images are captured
      scale: 2,      // Improves image quality
    })
      .then((canvas) => {
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'peacekeeper-card.png'; // Set the filename
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing the image:', error);
      })
      .finally(() => {
        // this.isLoading = false; // Hide the spinner if added
        this.display = "none";
        this.showPopup=false;
      });
      setTimeout(() => {
        this.display = "none";
        this.showPopup=false;
  
      }, 1000);
   

  }
  openPopup() {
    // this.peacekeeperBadgeId = 47
    if(this.peacekeeperBadgeId){
      let id = this.peacekeeperBadgeId
      this.DelegateService.getPeacekeeper_Badge(id).subscribe((res: any) => {
      this.peacekeeperData = res.data;
      this.fileUrl =  this.peacekeeperData.file_urls[0]
        
    });
  }
  console.log("modal peacekeeperData",this.peacekeeperData);
    
  
    this.showPopup = true;
    this.isPeaceOn = 0;
    this.display='block'
    this.formdisplay=false;
}
  closeModal() {
    
    this.display = "none";
    this.showPopup=false;
  }
  isCorrect() {
      this.isMobile = this.peacekeepersForm.value.mobile_number.dialCode + " " + this.peacekeepersForm.value.mobile_number.number
      this.display = "block";
      this.showPopup = true;
      this.isPeaceOn = 1;

    }
  getAllCountrycode() {
    
    this.DelegateService.getAllCountrycode().subscribe((res: any) => {
      console.log("code", res.data);
      this.code = res.data;
      // Define the country name you want to find (e.g., "India (+91)")
  const countryToFind = "India";
  
  // Find the object that matches the country name
  // const indiaCodeObject =  this.code.find((item:any) => item.name === countryToFind);
  // console.log(indiaCodeObject);
  
  //     this.peacekeepersForm.patchValue({
  //       country :indiaCodeObject.name
  //     })
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result; // Set the preview URL
    };
    reader.readAsDataURL(file);
    console.log('Selected file:', this.selectedFile);
  }
  

  ValidateAlpha(event: any) {
    var keyCode = (event.which) ? event.which : event.keyCode

    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
      return false;
    return true;

  }

  extractCountryCode(inputString: string): string | null {
    const countryCodeMatch = inputString.match(/\(\+(\d+)\)/);
    return countryCodeMatch ? `+${countryCodeMatch[1]}` : null;
  }

  
  submitData(fileInput: HTMLInputElement): void {
    this.display = "none";
    this.showPopup=false;
    console.log(this.peacekeepersForm.value.mobile_number.number,this.peacekeepersForm.value.mobile_number.dialCode)
  
  
      // const inputString = this.peacekeepersForm.value.country_code;
      // const countryCode = this.extractCountryCode(inputString);
      // console.log(countryCode); // Output: +91

      const rawMobileNumber = this.peacekeepersForm.value.mobile_number.number;
      const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces
      console.log(formattedMobileNumber);
          

      this.isCheckEmail = this.peacekeepersForm.value.Check_email
    this.peacekeepersForm.patchValue({
      is_active :1,
      Check_email:this.peacekeepersForm.value.Check_email == true? 1 : 0,
      // country_code: this.peacekeepersForm.value.mobile_number.countryCode,
      mobile_number: this.peacekeepersForm.value.mobile_number.dialCode + ' ' + formattedMobileNumber
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
        this.ngxService.stop();
      console.log("response", response);
      this.peacekeeperBadgeId = response.peacekeeper_id
      this.SharedService.ToastPopup('', response.message, 'success')
      this.peacekeepersForm.reset();

      this.selectedFile = null;
      fileInput.value = '';

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



keyPressNumbers(event: KeyboardEvent, inputValue: any) {
  // debugger
  if(inputValue !== null){
    
    if(inputValue.number.length<9){
      this.mobile_numberVal = true;
      // event.preventDefault()
    } else {
      this.mobile_numberVal = false;
    }
    
   }

 
}

onKeyDown(event: KeyboardEvent, inputValue: any): void {
  // Check if the pressed key is the space bar and the input is empty
  if (event.key === ' ' && inputValue.trim() === '') {
    event.preventDefault(); // Prevent the space character from being typed
  }
}

onMobileKeyDown(event: KeyboardEvent, inputValue: any): void {
  // Check if the pressed key is the space bar and the input is empty
  if(inputValue!==null){

  if (event.key === ' ' && inputValue.trim() === '') {
    event.preventDefault(); // Prevent the space character from being typed
  }else  if (event.code === 'Backspace') {
    if(inputValue.number.length<9){
      this.mobile_numberVal = true;
      // event.preventDefault()
    } else {
      this.mobile_numberVal = false;
    }
  }
}
}



getCountrycode(code: any){
  
  let countryName = this.peacekeepersForm.value.country;
  const indiaCodeObject =  code.find((item:any) => item.name === countryName);
  console.log(indiaCodeObject);
  
  this.peacekeepersForm.patchValue({
    // is_active :1,
    // Check_email:this.peacekeepersForm.value.Check_email == true? 1 : 0,
    country_code: indiaCodeObject.code
    // mobile_number: this.peacekeepersForm.value.mobile_number.dialCode + ' ' + formattedMobileNumber
  })
}

ngAfterViewInit(): void {
  this.route.fragment.subscribe((fragment) => {
    if (fragment) {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

}

