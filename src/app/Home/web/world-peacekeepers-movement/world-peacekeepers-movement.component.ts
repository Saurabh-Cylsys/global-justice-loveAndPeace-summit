import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-world-peacekeepers-movement',
  templateUrl: './world-peacekeepers-movement.component.html',
  styleUrls: ['./world-peacekeepers-movement.component.css']
})
export class WorldPeacekeepersMovementComponent implements OnInit{

  peacekeepersForm: any = FormGroup;
  reqBody: any;
  code: any;
  submitted = false;
  selectedFile: File | null = null;


  constructor( private formBuilder: FormBuilder,
     private DelegateService: DelegateService,
      private SharedService: SharedService,
       private ngxService: NgxUiLoaderService,
        private router: Router,
    private route: ActivatedRoute) {

   }
   getcontrol(name: any): AbstractControl | null {
    return this.peacekeepersForm.get(name);
  }
  get f() { return this.peacekeepersForm.controls; }
  ngOnInit(): void {

    this.peacekeepersForm = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      mobile_number: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
      ]],
      email_id: ['', [Validators.required, Validators.email]], // Using Validators.email for email format validation
      is_active: 1,
      
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
  // profile_picture:[''],

  onFileChange(event: any): void {
    
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitData(): void {
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
      console.log("response", response);
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

}

