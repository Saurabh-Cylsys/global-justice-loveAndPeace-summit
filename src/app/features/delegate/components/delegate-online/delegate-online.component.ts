import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DelegateService } from '../../services/delegate.service';

@Component({
  selector: 'app-delegate-online',
  templateUrl: './delegate-online.component.html',
  styleUrls: ['./delegate-online.component.css']
})
export class DelegateOnlineComponent {
  userForm!: FormGroup;
  showPaymentSection = false;
  paymentSuccess = false;
  paymentToken: string | null = null;
  paymentWindow: Window | null = null;

  constructor(private fb: FormBuilder,private delegateService: DelegateService,) {}

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

  // Determine if payment section should be shown
  checkFormValidity() {
    const emailValid = this.userForm.get('email')?.valid;
    const mobileValid = this.userForm.get('mobile')?.valid;
    this.showPaymentSection = !!(emailValid && mobileValid);
    this.checkoutSession(emailValid)
  }

  checkoutSession(emailValid: any) {
    if (!emailValid) return; // Exit early if email is not valid

    this.delegateService.postCheckoutSession({ email: emailValid }).subscribe({
      next: (response: any) => {
        if (response.url) window.location.href = response.url; // Redirect to Stripe Checkout
      },
      error: console.error.bind(console, 'Error creating checkout session:'),
    });
  }
  // Open the payment gateway in a popup
  openPaymentPopup() {
    const paymentUrl = 'https://your-payment-gateway.com'; // Replace with your payment gateway URL
    const options = 'width=600,height=600,left=200,top=100';
    this.paymentWindow = window.open(paymentUrl, 'PaymentWindow', options);
  }

  // Listen for messages from the payment gateway popup
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    // Validate the origin for security
    if (event.origin === 'https://your-payment-gateway.com') {
      // Check if the response contains a token
      if (event.data && event.data.token) {
        this.handlePaymentSuccess(event.data.token);
      }
    }
  }

  // Handle successful payment by saving the token and closing the popup
  handlePaymentSuccess(token: string) {
    this.paymentToken = token;
    this.paymentSuccess = true;
    if (this.paymentWindow) {
      this.paymentWindow.close();
    }
  }
}
