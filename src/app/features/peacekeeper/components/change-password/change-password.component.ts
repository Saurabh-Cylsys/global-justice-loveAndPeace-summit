import { Component, HostListener, Renderer2 } from '@angular/core';
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
  isCollapsed = false;
  isMobileView = false;

  constructor(
    private fb: FormBuilder,
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router : Router,
    private renderer: Renderer2
    ) {
      this.sharedService.isCollapsed$.subscribe((state) => {
        this.isCollapsed = state;
      });
  }

  ngOnInit(): void {
    this.crateChangePasswordForm();

    this.userData = JSON.parse(localStorage.getItem('userDetails') || '');


    this.changePasswordForm.get('email')?.disable();

    this.changePasswordForm.patchValue({
      email : this.userData.email || this.userData.email_id
    })

    this.checkWindowSize();
  }

  ngAfterViewInit() {
    const emailField = document.getElementById('email');

    if (emailField) {
      const observer = new MutationObserver(() => {
        if (!emailField.hasAttribute('disabled')) {
          emailField.setAttribute('disabled', 'true');
        }
      });

      observer.observe(emailField, { attributes: true, attributeFilter: ['disabled'] });
    }

    // setTimeout(() => {
    //   const passwordField = document.getElementById('password');
    //   if (passwordField) {
    //     this.renderer.selectRootElement(passwordField).focus();
    //   }
    // }, 0);
  }

  focusField(fieldId: string) {
    setTimeout(() => {
      const field = document.getElementById(fieldId);
      if (field) {
        this.renderer.selectRootElement(field).focus();
      }
    }, 0);
  }

  checkWindowSize(): void {
    if (window.innerWidth <= 900) {
      this.sharedService.isMobileView.next(true);
      this.isMobileView = true;
    } else {
      this.sharedService.isMobileView.next(false);
      this.isMobileView = false;
    }
  }
  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }


  crateChangePasswordForm(){
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
        Validators.minLength(8),
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
      if (this.changePasswordForm.get('password')?.invalid) {
        this.focusField('password');
      } else if (this.changePasswordForm.get('confirmPassword')?.invalid) {
        this.focusField('confirmPassword');
      }
      return;
    }

    const peacKeeperformData = this.changePasswordForm.getRawValue(); // ✅ Includes disabled fields
    console.log(peacKeeperformData);

    let body = {
      // "encrypted_data": encryptedBody
      "email": peacKeeperformData.email,
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
        this.sharedService.ToastPopup('', err.error.message, 'error');
        this.ngxService.stop();
      }
    })
  }
}
