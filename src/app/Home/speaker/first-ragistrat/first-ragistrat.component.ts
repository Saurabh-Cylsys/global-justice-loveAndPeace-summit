import { Component,HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SpeakerService } from '../services/speaker.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
declare var AOS: any;

@Component({
  selector: 'app-first-ragistrat',
  templateUrl: './first-ragistrat.component.html',
  styleUrls: ['./first-ragistrat.component.css']
})
export class FirstRagistratComponent {


  code: any;
  form: any = FormGroup;
  submitted: boolean = false;

  email_id: string = '';
  mobile_number: string = '';
  
  urn_no: string = '';
  form_name:any;
  constructor(
  
    private fb: FormBuilder,
    private SpeakerService: SpeakerService,
    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService
  ) {
    // Initialize the form controls with default values and validators
    this.form = this.fb.group({
      registration_type:['1',Validators.required],
      email_id: ['', [Validators.email]],  
      mobile_number: ['', [
        
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
       
      ]],
      urn_no: [''],  
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
    AOS.init({
      duration: 1200,
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

  @HostListener('keydown', ['$event'])
  onKeyDown1(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
  Check() {

     // Trim values before submitting
  this.form.controls['email_id'].setValue(this.form.controls['email_id'].value.trim());
  this.form.controls['mobile_number'].setValue(this.form.controls['mobile_number'].value.trim());
  this.form.controls['urn_no'].setValue(this.form.controls['urn_no'].value.trim());
  
  console.log(this.form.controls['urn_no'].value.trim());
console.log();
const registration_type = this.form.controls['registration_type'].value;
    const emailValue = this.form.controls['email_id'].value;
    const mobileValue = this.form.controls['mobile_number'].value;
    const urnValue = this.form.controls['urn_no'].value;
  

    if (!emailValue && !mobileValue && !urnValue) {
      // Display error if none of the fields are filled
      // console.log("1", emailValue);
      this.SharedService.ToastPopup('', 'Please fill any of the field!', 'error');
    } else {
      // Proceed only if at least one field has a value
      console.log("registration_type", registration_type);
  
      let signUpData = {
        registration_type:registration_type,
        email_id: emailValue,
        mobile_number: mobileValue,
        urn_no: urnValue,
      };
  
      console.log(signUpData, this.form.value);
      this.ngxService.start();
  
      // this.SpeakerService.checkEmailAndMobile(signUpData).subscribe((res: any) => {
      //   if (res.success) {
      //     console.log("res", res.data[0].filepath,res.data[0].urn_no);
      //     let filepath=res.data[0].filepath;
      //     let urn_no=res.data[0].urn_no;
      //     this.downloadBadge(filepath,urn_no);
      //     this.ngxService.stop();
         
      //   } else {
      //     this.ngxService.stop();
      //     this.SharedService.ToastPopup('', res.message, 'error');
      //   }
      // }, (err: any) => {
      //   this.ngxService.stop();
      //   this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
      // });
      this.SpeakerService.checkEmailAndMobile(signUpData).subscribe((res: any) => {
        if (res.success) {
          console.log("scan res",res.data[0].scanned_badge_file_path,res.data[0].urn_no);
          let urn_no=res.data[0].urn_no;
          if(res.data[0].registration_type==="1")
          {    this.form_name="delegate"
console.log(this.form_name);

          }
          if(res.data[0].registration_type==="2"){
            this.form_name="partner"
            console.log(this.form_name);

          }
          if(res.data[0].registration_type==="3"){
            this.form_name="speaker"
            console.log(this.form_name);

          }
          let data={
           user_id:res.data[0].user_id,
            urn_no: res.data[0].urn_no,
            user_name: res.data[0].title+' '+res.data[0].first_name+' '+res.data[0].last_name,
            company: res.data[0].company_name,
            qr_code: res.data[0].qr_code,
            country_name:res.data[0].country_name,
            form_name:this.form_name
          }
          console.log("download badge",data);
          this.SpeakerService.user_badge(data).subscribe((res: any) => {
           

            console.log("download badge generated successfully!");
            this.SpeakerService.checkEmailAndMobile(signUpData).subscribe((res1: any) => {
             let download_badge_file_path=res1.data[0].download_badge_file_path;
                 // Use setTimeout to simulate a delay, replace it with actual logic
        
  setTimeout(() => {
    this.ngxService.stop();

       this.downloadBadge(download_badge_file_path, urn_no);

     }, 8000);
             
            },(err:any)=>{
             console.log("error");    
                      })
          },(err:any)=>{
 console.log("error");
 
          })
         
         
        } else {
          this.ngxService.stop();
          this.SharedService.ToastPopup('', res.message, 'error');
        }
      }, (err: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
      });
    }
  }
  

  
  ScanBadge() {

    // Trim values before submitting
 this.form.controls['email_id'].setValue(this.form.controls['email_id'].value.trim());
 this.form.controls['mobile_number'].setValue(this.form.controls['mobile_number'].value.trim());
 this.form.controls['urn_no'].setValue(this.form.controls['urn_no'].value.trim());
 
 console.log(this.form.controls['urn_no'].value.trim());
console.log();
const registration_type = this.form.controls['registration_type'].value;
   const emailValue = this.form.controls['email_id'].value;
   const mobileValue = this.form.controls['mobile_number'].value;
   const urnValue = this.form.controls['urn_no'].value;
 

   if (!emailValue && !mobileValue && !urnValue) {
     // Display error if none of the fields are filled
     // console.log("1", emailValue);
     this.SharedService.ToastPopup('', 'Please fill any of the field!', 'error');
   } else {
     // Proceed only if at least one field has a value
     console.log("scan registration_type", registration_type);
 
     let signUpData = {
       registration_type:registration_type,
       email_id: emailValue,
       mobile_number: mobileValue,
       urn_no: urnValue,
     };
 
     console.log(signUpData, this.form.value);
     this.ngxService.start();
 
     this.SpeakerService.checkEmailAndMobile(signUpData).subscribe((res: any) => {
       if (res.success) {
         console.log("scan res",res.data[0].scanned_badge_file_path,res.data[0].urn_no);
         let urn_no=res.data[0].urn_no;
         let data={
          user_id:res.data[0].user_id,
           urn_no: res.data[0].urn_no,
           user_name: res.data[0].title+' '+res.data[0].first_name+' '+res.data[0].last_name,
           company: res.data[0].company_name,
           qr_code: res.data[0].qr_code,
           country_name:res.data[0].country_name
         }
         console.log("scanned badge",data);
         this.SpeakerService.ScannedBadge(data).subscribe((res: any) => {

           console.log("scanned badge generated successfully!");
           this.SpeakerService.checkEmailAndMobile(signUpData).subscribe((res1: any) => {
            let scanfilepath=res1.data[0].scanned_badge_file_path;
                // Use setTimeout to simulate a delay, replace it with actual logic
    setTimeout(() => {
      this.ngxService.stop();

      this.downloadBadge(scanfilepath, urn_no);
    }, 2000);
            // this.downloadBadge(scanfilepath,urn_no);
           },(err:any)=>{
            console.log("error");    
                     })
         },(err:any)=>{
console.log("error");

         })
         // this.SharedService.ToastPopup('', res.message, 'success');
         // this.form.reset(); 
         // this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
         //   this.router.navigateByUrl('/home');
         // });
       } else {
         this.ngxService.stop();
         this.SharedService.ToastPopup('', res.message, 'error');
       }
     }, (err: any) => {
       this.ngxService.stop();
       this.SharedService.ToastPopup('Please Enter Valid Data ', '', 'error');
     });
   }
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

  downloadBadge(filepath:any,urn_no:any) {

    const payload = {
      filepath:filepath
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  console.log(payload);
  
  // Make the HTTP request to download the PDF
  this.SpeakerService.Download_Badge(payload)
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `${urn_no}.pdf`); // You can customize the filename

        this.SharedService.ToastPopup('', "Badge has been downloaded!", 'success');
// Reset specific form controls after successful download
this.form.get('email_id')?.setValue('');
this.form.get('mobile_number')?.setValue('');
this.form.get('urn_no')?.setValue('');
      }, (err: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Badge not found! Please Contact the Admin.', '', 'error');
      });
  
  }
  

  submitForm(action: string) {
    if (action === 'downloadbadge') {
      this.Check();
    } else{
      this.ScanBadge();
    }
  }
}





