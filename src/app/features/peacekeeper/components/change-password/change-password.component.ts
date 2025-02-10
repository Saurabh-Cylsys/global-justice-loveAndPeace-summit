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
    }, { validator: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(group: FormGroup) {
    debugger
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }
  getcontrol(name: any): AbstractControl | null {
    return this.changePasswordForm.get(name);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    debugger
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    
    const formData = this.changePasswordForm.value;


    const EncryptData = this.sharedService.encryptData(formData);
    const encryptedPayload = new FormData();
    encryptedPayload.append('encrypted_data', EncryptData);

    this.peaceKeeperService.changePasswordPeacekeeper(encryptedPayload).subscribe(
      (response:any) => {
        console.log('Password changed successfully', response);
      },
      (error:any) => {
        console.error('Error changing password', error);
      }
    );
  }
}
