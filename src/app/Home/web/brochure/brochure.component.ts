import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SpeakerService } from '../../speaker/services/speaker.service';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';

declare var AOS: any;
@Component({
  selector: 'app-brochure',
  templateUrl: './brochure.component.html',
  styleUrls: ['./brochure.component.css']
})
export class BrochureComponent {
  area_of_interest_get:any;
  status:boolean=false;
  cptcha: any;
  captchaMatched = false;
  captchaError = false;
  code: any;
  brochure: any = FormGroup;
  submitted: boolean = false;
  
  jobTitle: string = '';
  companyName: string = '';
  captcha: string = '';
  mobile: string = '';
  phone_number: string = '';
  email: string = '';
  contact_name: string = '';
  constructor(
    private fb: FormBuilder,
    private DelegateService: DelegateService,
    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private SpeakerService: SpeakerService

  ) {
    // Initialize the form controls with default values and validators
    this.brochure = this.fb.group({
      contact_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      job_tittle: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(100)]],
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      country: ['', [Validators.required]],
      
   
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(),this.containsConsecutiveZeros()
      ]],
      phone_number: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(),this.containsConsecutiveZeros()
      ]],
      area_of_interest: ['', Validators.requiredTrue],
      check_whatsapp_number: [''],
      check_details: [''],
      captcha: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  // Add a getter for easier access to form controls
  get f() {
    return this.brochure.controls;
  }

  getcontrol(name: any): AbstractControl | null {
    return this.brochure.get(name);
  }

  // Initialize when the component is loaded
  ngOnInit(): void {
    this.getAllCountrycode();
    this.captchaa();
    AOS.init({
      duration: 1200,
    });
  }

  // Fetch country codes
  getAllCountrycode() {
    this.DelegateService.getAllCountrycode().subscribe((res: any) => {
      console.log("code", res.data);
      this.code = res.data;
    }, (err: any) => {
      console.log("error", err);
    });
  }

  // Fetch CAPTCHA
  captchaa() {
    this.SharedService.capchaa().subscribe((res: any) => {
      console.log("cobgvde", res);
      this.cptcha = res.captcha;
    }, (err: any) => {
      console.log("error", err);
    });
  }

  // Allow only numbers in input
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

  // Validate input for alphabets
  ValidateAlpha(event: any) {
    var keyCode = (event.which) ? event.which : event.keyCode;
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
      return false;
    return true;
  }

  // Check CAPTCHA and submit the brochure
  added() {
    const captchaValue = this.brochure.get('captcha').value;
    console.log(captchaValue)

    // Check the CAPTCHA input here and set captchaMatched accordingly
    if (captchaValue == this.cptcha) {
      this.captchaMatched = true;
      // Now, you can submit the brochure data
      this.Submit();
    } else {
      this.captchaMatched = false;
      this.captchaError = true;
      this.SharedService.ToastPopup('Please enter valid captcha', '', 'error');

    }
  }
  onKeyDown(event: KeyboardEvent, inputValue: string): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
    }
  }
  // Handle brochure submission
  Submit() {

    this.ngxService.start();
    let signUpData = {
      contact_name: this.brochure.controls['contact_name'].value,
      email: this.brochure.controls['email'].value,
      job_tittle: this.brochure.controls['job_tittle'].value,
      company_name: this.brochure.controls['company_name'].value,
      country: this.brochure.controls['country'].value,
      mobile: this.brochure.controls['mobile'].value,
      phone_number: this.brochure.controls['phone_number'].value,
      area_of_interest: this.brochure.controls['area_of_interest'].value,
      check_whatsapp_number: this.brochure.controls['check_whatsapp_number'].value,
      check_details: this.brochure.controls['check_details'].value,
    }

    console.log(signUpData)

    this.SharedService.addbrochure(signUpData).subscribe((res: any) => {
      if (res.success) {
        console.log("res", res);
        this.ngxService.stop();
        this.SharedService.ToastPopup('', res.message, 'success')
        this.downloadBadge();
        this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl('/home');
        });
      } else {
        this.ngxService.stop();
        this.SharedService.ToastPopup('', res.message, 'error')
      }
      return this.brochure.reset({});
    }, (err) => {
      this.ngxService.stop();
      // Display error message if OTP is not found or there's an error in API call
      this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
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

  onRadioChange(event: Event) {
    // Handle the radio button change event
    const target = event.target as HTMLInputElement;
    console.log(target);
    
    if (target.checked) {

      console.log(this.brochure.value.area_of_interest);
      
    this.area_of_interest_get=  this.brochure.value.area_of_interest
console.log(this.area_of_interest_get);

this.status=true;

    }
  
}


downloadBadge() {

  const payload = {
    filepath:"src/uploads/broucher/Pre_Connect_Spex_Bro.pdf"
  };
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
console.log(payload);

// Make the HTTP request to download the PDF
this.SpeakerService.Download_Badge(payload)
    .subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, `Pre_Connect_Spex_Bro.pdf`); // You can customize the filename

      this.SharedService.ToastPopup('', "Broucher has been downloaded!", 'success');

    }, (err: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Broucher not found! Please Contact the Admin.', '', 'error');
    });

}
}

