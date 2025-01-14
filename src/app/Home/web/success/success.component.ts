
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DelegateService } from '../../delegate/services/delegate.service';

@Component({
  selector: 'app-success',
  template: `
<h1>Payment Successful</h1>
<p>Your Transaction ID: {{ transactionId }}</p>
  `,
})
export class SuccessComponent implements OnInit {
  transactionId: string | null = null;
  isPaymentSuccessful: boolean = false;
  isPaymentStatus:  string = 'success';
  isPaymentError: boolean = false;
  errorMessage: string = '';
  sessionId: string | null = null;
  transactionVerified: boolean = false;
 
  constructor(private route: ActivatedRoute,
    private DelegateService: DelegateService,
     private http: HttpClient) {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['prefilled_email'] || 'No email';
    });
  }
 
  ngOnInit() {

    this.verifySession();

  }
verifySession(){
let body={
  session_id: this.sessionId
}
  this.DelegateService.postVerifySession(body).subscribe({
    next: (response:any) => {
              if (response.success) {
                console.log('Session Verified:', response.session);
                this.isPaymentStatus = response.status;
                this.transactionVerified = true;
              } else {
                this.isPaymentStatus = response.status;
                console.error('Payment not completed:', response.message);
              }
            },
            error: (err) => console.error('Error verifying session:', err),
  });
}

  // if (this.sessionId) {
  //   // Call the backend to verify the session
  //   this.http
  //     .post<any>('http://localhost:3000/verify-session', { session_id: this.sessionId })
  //     .subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           console.log('Session Verified:', response.session);
  //           this.transactionVerified = true;
  //         } else {
  //           console.error('Payment not completed:', response.message);
  //         }
  //       },
  //       error: (err) => console.error('Error verifying session:', err),
  //     });
  // }
}
