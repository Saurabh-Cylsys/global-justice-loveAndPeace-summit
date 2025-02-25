import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-delegate-online',
  templateUrl: './delegate-online.component.html',
  styleUrls: ['./delegate-online.component.css']
})
export class DelegateOnlineComponent {
  userForm!: FormGroup;
  showPaymentSection = false;
  paymentSuccess = false;
  paymentLink: SafeResourceUrl | null = null;
  loading = false;
  constructor(private fb: FormBuilder, 
    private delegateService: DelegateService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService
  ) {}
  ngOnInit() {
    this.userForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required]
    });

    // Check form validity when email or mobile changes
    this.userForm.get('email')?.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
    this.userForm.get('mobile')?.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }

  onBlur(field: string) {
    // const control = this.userForm.get(field);
    // if (control && control.valid) {
    //   this.createDelegateOnline();
    // }
  }
  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const payload = {
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        mobile_no: this.userForm.get('mobile')?.value
      };
      
      this.delegateService.postDelegateOnline(payload).subscribe({
        next: (response: any) => {
          console.log('Delegate created successfully:', response);
          this.sharedService.ToastPopup('', response.message, 'success');
          this.userForm.reset();

            setTimeout(() => {
              console.log('get payment URL', response.payment_link);              
              if (response.payment_link) {
                window.location.href = response.payment_link; // Redirect to Stripe Checkout
              }
            }, 5000);
          this.loading = false;
        },
        error: (error:any) => {
          console.error('Error creating delegate:', error);
          this.loading = false;
        }
      });
    }
  }
  checkFormValidity() {
    if (this.userForm.valid) {
      //this.createDelegateOnline();
    }
  }
  // Handle payment completion
  handlePaymentSuccess() {
    this.paymentSuccess = true;
  }
}
