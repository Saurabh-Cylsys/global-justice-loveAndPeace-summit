import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DelegateService } from '../../services/delegate.service';

@Component({
  selector: 'app-ambassador',
  templateUrl: './ambassador.component.html',
  styleUrls: ['./ambassador.component.css']
})
export class AmbassadorComponent {
  
  name: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute,private delegateService:DelegateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.name = params.get('name'); // Retrieve the 'name' parameter from the URL
      if (this.name) {
        // Navigate to the desired route with the 'name' parameter
        let body = {
          "coupon_code": this.name
        }
        await this.delegateService.getAmbassadorURL(body).subscribe((resp:any) => {
          console.log(resp);          
          this.router.navigate(['']);
        });
      }
    });
  }
}
