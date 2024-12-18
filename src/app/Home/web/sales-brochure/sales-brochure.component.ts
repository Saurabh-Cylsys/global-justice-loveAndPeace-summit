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
  selector: 'app-sales-brochure',
  templateUrl: './sales-brochure.component.html',
  styleUrls: ['./sales-brochure.component.css']
})

export class SalesBrochureComponent {


  // Initialize variables
  cptcha: any;
  captchaMatched = false;
  captchaError = false;
  code: any;
  form: any = FormGroup;
  submitted: boolean = false;
  state_id: any;
  cityData: any;
  city_id: any;
  country_id:any;
  statesData:any;
  countryData: any;
  first_name: string = '';
  last_name: string = '';
  designation: string = '';
  department: string = '';
  company_name: string = '';
  work_email: string = '';
  work_phone_number: string = '';
  postcode: string = '';
  captcha: string = '';
  ngOnInit(): void {

      this.getAllCountries()
    this.captchaa();

    AOS.init({
      duration: 1200,
    });
    console.log("sales");
    
  }

  constructor(
    
    private fb: FormBuilder,
    private DelegateService: DelegateService,
    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private SpeakerService: SpeakerService

  ) {
    // Initialize the form controls with default values and validators
    this.form = this.fb.group({
      // title: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      last_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      department: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    work_email: ['', [Validators.required, Validators.email]],
   
    work_phone_number: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(),this.containsConsecutiveZeros()
      ]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$'),this.containsConsecutiveZeros()]],
      check_whatsapp_number: ['', Validators.requiredTrue],
      check_details: ['',Validators.requiredTrue],
      captcha: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
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

  getAllCountries() {
    this.DelegateService.getAllCountries().subscribe((res: any) => {
      console.log("CountryData1", res.data);
      this.countryData = res.data;
    }, (err: any) => {
      console.log("error", err);
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


  // Add a getter for easier access to form controls
  get f() {
    return this.form.controls;
  }

  getcontrol(name: any): AbstractControl | null {
    return this.form.get(name);
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

  onKeyDown(event: KeyboardEvent, inputValue: string): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
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
  

    changeCountry(e: any) {
      this.country_id = e.target.value;
      this.ngxService.start();
      this.DelegateService.getAllStates(this.country_id).subscribe((res: any) => {
        this.ngxService.stop();
        this.statesData = res.data;
      }, (err: any) => {
        console.log("Err", err);
        this.ngxService.stop();
      });
    }

    onSubmit() {

      this.ngxService.start();
      let signUpData = {
        first_name: this.form.controls['first_name'].value,
        last_name: this.form.controls['last_name'].value,
        company_name: this.form.controls['company_name'].value,
        department: this.form.controls['department'].value,
        designation: this.form.controls['designation'].value,
        work_email: this.form.controls['work_email'].value,
        work_phone_number: this.form.controls['work_phone_number'].value,
        country: this.form.controls['country'].value,
        state: this.form.controls['state'].value,
        city: this.form.controls['city'].value,
        postcode: this.form.controls['postcode'].value,
        check_whatsapp_number: this.form.controls['check_whatsapp_number'].value,
        check_details: this.form.controls['check_details'].value,
      }
  
      console.log(signUpData)
  
      this.SharedService.brochure(signUpData).subscribe((res: any) => {
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
        return this.form.reset({});
      }, (err) => {
        this.ngxService.stop();
        // Display error message if OTP is not found or there's an error in API call
        this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
      });
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
