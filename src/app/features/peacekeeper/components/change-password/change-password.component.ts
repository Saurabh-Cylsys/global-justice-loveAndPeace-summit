import { DatePipe } from '@angular/common';
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

  constructor(
private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    ) {

  }

  ngOnInit(): void {
    this.crateChangePasswordForm();

  }

  crateChangePasswordForm(){
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.ConfirmPasswordValidator(
        "password",
        "confirmPassword"
      ),
    });
  }

  passwordMatchValidator(group: FormGroup) {
    debugger
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

  onSubmit() {

    if (this.changePasswordForm.invalid) {
      return;
    }

    let body = {
      "email": this.changePasswordForm.value.email,
      "password": this.changePasswordForm.value.password,
      "confirmPassword": this.changePasswordForm.value.confirmPassword
    }

    this.ngxService.start();
    this.peaceKeeperService.generatePasswordApi(body).subscribe({
      next : (res:any)=>{
        console.log("Res",res);
        this.ngxService.stop();
        this.changePasswordForm.reset();
        this.sharedService.ToastPopup(res.message,'','success');
      },
      error : (err)=>{
        console.log("Error",err);
        this.ngxService.stop();
      }
    })
  }
}
