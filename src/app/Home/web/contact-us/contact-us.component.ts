import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';

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

  constructor( private formBuilder: FormBuilder, private DelegateService: DelegateService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private httpClient: HttpClient,private route: ActivatedRoute) {

   }
   getcontrol(name: any): AbstractControl | null {
    return this.contactUsForm.get(name);
  }
  get f() { return this.contactUsForm.controls; }
  ngOnInit(): void {
    this.getAllCountrycode()

    this.contactUsForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      countryCode: ['', [Validators.required]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(),  this.containsConsecutiveZeros()
      ]],
      email: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      yourQuestion: [''],

    });

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
  submitData(): void {
    console.log(this.contactUsForm.value);
    this.submitted = true;
    if (this.contactUsForm.invalid) {
      return console.log('Invalid Details');
    }
    if (this.submitted) {
      const { valid } =
        this.contactUsForm;
      if (valid) {
        this.reqBody = {
          ...this.contactUsForm.value,
        };
        console.log("this.contactUsForm.value", this.contactUsForm.value);
        this.ngxService.start();
        this.SharedService.contectUs(this.reqBody).subscribe((result: any) => {
          if (result.success) {
            console.log("result", result);
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'success')        
           
          } 
        },(err) => {
          this.ngxService.stop();
  
     
            this.SharedService.ToastPopup('', err.error.message, 'error')

          
        }
        );
      }  
      else {
        return this.contactUsForm.reset({});
      }

    }
  }

}
