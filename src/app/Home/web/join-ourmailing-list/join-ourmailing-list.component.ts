import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var AOS: any;

@Component({
  selector: 'app-join-ourmailing-list',
  templateUrl: './join-ourmailing-list.component.html',
  styleUrls: ['./join-ourmailing-list.component.css']
})
export class JoinOurmailingListComponent {


  // Initialize variables
  cptcha: any;
  captchaMatched = false;
  captchaError = false;
  code: any;
  form: any = FormGroup;
  submitted: boolean = false;
  first_name: string = '';
  last_name: string = '';
  company_name: string = '';
  designation: string = '';
  email: string = '';
  mobile_number: string = '';
  captcha: string = '';
 
  constructor(
  
    private fb: FormBuilder,
    private DelegateService: DelegateService,
    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService
  ) {
    // Initialize the form controls with default values and validators
    this.form = this.fb.group({
      title: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      last_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
   
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(), this.containsConsecutiveZeros()
      ]],
      country: ['', Validators.required],
      whatsaap_number_check: [, Validators.requiredTrue],
      informa_market_check: [, Validators.requiredTrue],
      captcha: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  // Add a getter for easier access to form controls
  get f() {
    return this.form.controls;
  }

  getcontrol(name: any): AbstractControl | null {
    return this.form.get(name);
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
  onKeyDown(event: KeyboardEvent, inputValue: string): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
    }
  }
  // Check CAPTCHA and submit the form
  jmit() {
    const captchaValue = this.form.get('captcha').value;
    console.log(captchaValue)

    // Check the CAPTCHA input here and set captchaMatched accordingly
    if (captchaValue == this.cptcha) {
      this.captchaMatched = true;
      // Now, you can submit the form data
      this.onSubmit();
    } else {
      this.captchaMatched = false;
      this.captchaError = true;
      this.SharedService.ToastPopup('Please enter valid captcha', '', 'error');

    }
  }
 
  onSubmit() {

    this.ngxService.start();
    let signUpData = {
      title: this.form.controls['title'].value,
      first_name: this.form.controls['first_name'].value,
      last_name: this.form.controls['last_name'].value,
      company_name: this.form.controls['company_name'].value,
      designation: this.form.controls['designation'].value,
      email: this.form.controls['email'].value,
      mobile: this.form.controls['mobile'].value,
      country: this.form.controls['country'].value,
      whatsaap_number_check: this.form.controls['whatsaap_number_check'].value,
      informa_market_check: this.form.controls['informa_market_check'].value,
    }

    console.log(signUpData)

    this.SharedService.registratiotjoin(signUpData).subscribe((res: any) => {
      if (res.success) {
        console.log("res", res);
        this.ngxService.stop();
        this.SharedService.ToastPopup('', res.message, 'success')
        this.router.navigateByUrl('/webhome', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl('/webhome');
        });
      } else {
        this.ngxService.stop();
        this.SharedService.ToastPopup('', res.message, 'error')
      }
      return this.form.reset({});
    }, (err) => {
      this.ngxService.stop();
      // Display error message if OTP is not found or there's an error in API call
      this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
    });
  }
  noRepeatingDigits(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && value.length === 10) {
        // Check for repeating digits
        const repeatingDigits = /(.)\1{4,}/.test(value);
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
      if (value && /000/.test(value)) {
        return { containsConsecutiveZeros: true };
      }
      return null;
    };
  }
}
