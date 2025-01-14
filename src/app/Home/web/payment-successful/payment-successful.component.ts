import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.css']
})
export class PaymentSuccessfulComponent implements OnInit{
  isPaymentSuccessful: boolean = false;
  isPaymentError: boolean = false;
  errorMessage: string = '';
  constructor(private router: Router) {}
  ngOnInit(): void {

  }

  redirectToDashboard(): void {
    this.router.navigate(['/home']); // Adjust route as needed
  }
}
