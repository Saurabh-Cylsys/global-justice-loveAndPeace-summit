import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PeacekeeperService } from '../../services/peacekeeper.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  userData : any;

  constructor(
    private fb: FormBuilder,
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router : Router
    ) {

  }

  ngOnInit(): void {
    this.crateChangePasswordForm();

    this.userData = JSON.parse(localStorage.getItem('userDetails') || '');

    this.changePasswordForm.patchValue({
      email : this.userData.email
    })
  }

  crateChangePasswordForm(){
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$')]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.ConfirmPasswordValidator(
        "password",
        "confirmPassword"
      ),
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmPasswordValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getcontrol(name: any): AbstractControl | null {
    return this.changePasswordForm.get(name);
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  onSubmit() {

    if (this.changePasswordForm.invalid) {
      return;
    }

    // let encryptedBody = this.sharedService.encryptData({
    //   "email": this.changePasswordForm.value.email,
    //   "password": this.changePasswordForm.value.password,
    //   "confirmPassword": this.changePasswordForm.value.confirmPassword
    // });

    let body = {
      // "encrypted_data": encryptedBody
      "email": this.changePasswordForm.value.email,
      "password": this.changePasswordForm.value.password,
      "confirmPassword": this.changePasswordForm.value.confirmPassword
    };

    this.ngxService.start();
    this.peaceKeeperService.generatePasswordApi(body).subscribe({
      next : (res:any)=>{
        console.log("Res",res);
        this.ngxService.stop();
        // this.changePasswordForm.patchValue({
        //   password : "",
        //   confirmPassword : ""
        // })
        this.router.navigate(['/dashboard']);
        this.sharedService.ToastPopup(res.message,'','success');
      },
      error : (err)=>{
        console.log("Error",err);
        this.ngxService.stop();
      }
    })
  }
}
