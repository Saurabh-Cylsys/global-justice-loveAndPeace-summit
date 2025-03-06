import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delegate-payment-fail',
  templateUrl: './delegate-payment-fail.component.html',
  styleUrls: ['./delegate-payment-fail.component.css']
})
export class DelegatePaymentFailComponent implements OnInit {
  status: 'success' | 'error' | 'pending' = 'pending';
  transactionId?: string;
  errorCode?: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get all query parameters from the URL
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        this.status = 'success';
        this.transactionId = params['txnId'];
      } else {
        this.status = 'error';
        this.errorCode = params['code'];
      }
    });
  }


}
