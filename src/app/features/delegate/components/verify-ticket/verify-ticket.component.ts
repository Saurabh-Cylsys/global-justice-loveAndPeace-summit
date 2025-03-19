import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { DelegateService } from '../../services/delegate.service';

@Component({
  selector: 'app-verify-ticket',
  templateUrl: './verify-ticket.component.html',
  styleUrls: ['./verify-ticket.component.css']
})
export class VerifyTicketComponent {

  constructor(private router: Router,
              private route: ActivatedRoute ,
              private encryptionService:EncryptionService ,
              private delegateService:DelegateService) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params: any) => {

      if (params != undefined && Object.keys(params).length > 0) {

        let ticketData = params['data'].replace(/ /g, '+');

        let decryptedData = this.encryptionService.decrypt(ticketData);

        // Parse the decrypted string into key-value pairs
        const urlParams = new URLSearchParams(decryptedData);

        // Extract values
        let ticketId = urlParams.get('ticket_id');
        let ticketUrl = urlParams.get('ticket_url');
        let type = urlParams.get('type');

        console.log("Ticket ID:", ticketId);
        console.log("Ticket URL:", ticketUrl);
        console.log("Ticket type:", type);

      }
    });
  }
}
