import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit{
  stripe:any;
    constructor(private router: Router,
      private route :ActivatedRoute
    ) {}
    ngOnInit(): void {
      this.route.queryParams.subscribe(async (params:any) => {
        if(params){
          // https://buy.stripe.com/test_3cs034dnw3df4r67sv?prefilled_email=uday%40gmail.com
          const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                    { price: 'price_12345', quantity: 1 },
                ],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            metadata: {
            userId: '12345',
            orderId: 'abcde',
                },
            });
        }
      });   
    
    }

}
